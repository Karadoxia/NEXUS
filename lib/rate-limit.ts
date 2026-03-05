/**
 * ══════════════════════════════════════════════════════════════
 * API RATE LIMITING — Multi-layer protection
 * Protects: auth endpoints, admin routes, general API
 * Strategy: In-memory (fast) + Redis (persistent + multi-server)
 * ══════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────────────────────
// CONFIGURATION
// ──────────────────────────────────────────────────────────────

export const RATE_LIMIT_CONFIG = {
  // Authentication endpoints — very strict
  auth: {
    max: 5,           // 5 attempts allowed
    windowSecs: 900,  // per 15 minutes
    penalty: 3600,    // after limit: 1 hour ban
  },

  // Sensitive admin operations
  admin: {
    max: 100,
    windowSecs: 60,   // per 1 minute
    penalty: 3600,
  },

  // General API routes
  api: {
    max: 300,
    windowSecs: 60,   // per 1 minute
    penalty: 600,     // 10 min mild penalty
  },

  // Public pages / storefront
  public: {
    max: 1000,
    windowSecs: 60,
    penalty: 300,
  },
};

// ──────────────────────────────────────────────────────────────
// IN-MEMORY RATE LIMIT STORE (fast, survives restarts of Redis)
// ──────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
  penaltyUntil?: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes (disabled in Edge)
if (process.env.NEXT_RUNTIME !== 'edge') {
  setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((value, key) => {
      if (value.resetAt < now) {
        memoryStore.delete(key);
      }
    });
  }, 300_000); // 5 minutes
}

/**
 * In-memory rate limiter (single server, instant response)
 * Good for: development, single-server deployments, backup if Redis is down
 */
export function rateLimitMemory(
  identifier: string,
  config: { max: number; windowSecs: number }
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = memoryStore.get(identifier);

  // If penalty active, reject
  if (existing?.penaltyUntil && existing.penaltyUntil > now) {
    return {
      success: false,
      remaining: 0,
      resetAt: existing.penaltyUntil,
    };
  }

  // If window expired, reset
  if (!existing || existing.resetAt < now) {
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowSecs * 1000,
    });
    return {
      success: true,
      remaining: config.max - 1,
      resetAt: now + config.windowSecs * 1000,
    };
  }

  // Check if limit exceeded
  if (existing.count >= config.max) {
    // Apply penalty
    existing.penaltyUntil = now + 3600 * 1000; // 1 hour ban
    return {
      success: false,
      remaining: 0,
      resetAt: existing.penaltyUntil,
    };
  }

  // Increment and allow
  existing.count++;
  return {
    success: true,
    remaining: config.max - existing.count,
    resetAt: existing.resetAt,
  };
}

// ──────────────────────────────────────────────────────────────
// REDIS RATE LIMIT STORE (persists across restarts, multi-server)
// ──────────────────────────────────────────────────────────────

let redis: any = null;

async function getRedis() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return null; // Redis (ioredis) is not compatible with Edge Runtime
  }

  if (!redis) {
    try {
      const { Redis } = await import("ioredis");
      redis = new Redis(process.env.REDIS_URL || "redis://redis:6379");
      redis.on("error", (err: any) => {
        console.error("Redis connection error in rate limiter:", err);
      });
    } catch (e) {
      console.error("Failed to load ioredis:", e);
      return null;
    }
  }
  return redis;
}

/**
 * Redis-based rate limiter (multi-server, atomic, persists)
 * Uses Lua script for atomicity (no race conditions)
 */
export async function rateLimitRedis(
  identifier: string,
  config: { max: number; windowSecs: number }
): Promise<{
  success: boolean;
  remaining: number;
  resetAt: number;
  usedRedis: boolean;
}> {
  try {
    const redis = await getRedis();
    if (!redis) {
      return {
        ...rateLimitMemory(identifier, config),
        usedRedis: false,
      };
    }
    const key = `rl:count:${identifier}`;
    const penaltyKey = `rl:penalty:${identifier}`;

    // Check if under penalty
    const penalty = await redis.ttl(penaltyKey);
    if (penalty > 0) {
      return {
        success: false,
        remaining: 0,
        resetAt: Date.now() + penalty * 1000,
        usedRedis: true,
      };
    }

    // Atomic increment with auto-expiry (Lua script)
    const result = (await redis.eval(
      `
      local count = redis.call('INCR', KEYS[1])
      if count == 1 then
        redis.call('EXPIRE', KEYS[1], ARGV[1])
      end
      local ttl = redis.call('TTL', KEYS[1])
      return {count, ttl}
      `,
      1,
      key,
      config.windowSecs
    )) as [number, number];

    const [count, ttl] = result;
    const success = count <= config.max;

    if (!success) {
      // Apply penalty
      await redis.setex(penaltyKey, 3600, "1"); // 1 hour ban
    }

    return {
      success,
      remaining: Math.max(0, config.max - count),
      resetAt: Date.now() + ttl * 1000,
      usedRedis: true,
    };
  } catch (error) {
    console.error("Redis rate limit error, falling back to memory:", error);
    // Fall back to memory store
    return {
      ...rateLimitMemory(identifier, config),
      usedRedis: false,
    };
  }
}

// ──────────────────────────────────────────────────────────────
// PROGRESSIVE PENALTIES (repeat offenders get harsher bans)
// ──────────────────────────────────────────────────────────────

export async function progressiveRateLimit(
  identifier: string,
  routeType: keyof typeof RATE_LIMIT_CONFIG
): Promise<{
  success: boolean;
  remaining: number;
  resetAt: number;
  offense: number;
}> {
  try {
    const redis = await getRedis();
    if (!redis) {
      return {
        success: false,
        remaining: 0,
        resetAt: Date.now() + 3600000,
        offense: -1,
      };
    }
    const offenseKey = `rl:offense:${identifier}`;
    const offenses = parseInt((await redis.get(offenseKey)) || "0");

    // Escalating penalties
    const windows = [
      { max: 5, windowSecs: 900 },    // 1st: 5 tries/15min
      { max: 3, windowSecs: 3600 },   // 2nd: 3 tries/1hr
      { max: 1, windowSecs: 86400 },  // 3rd: 1 try/24hr
    ];

    const config =
      windows[Math.min(offenses, windows.length - 1)] ||
      windows[windows.length - 1];
    const result = await rateLimitRedis(`auth:${identifier}`, config);

    if (!result.success) {
      // Escalate offense level
      await redis.incr(offenseKey);
      await redis.expire(offenseKey, 86400 * 30); // Track for 30 days
    }

    return {
      ...result,
      offense: offenses + (result.success ? 0 : 1),
    };
  } catch (error) {
    console.error("Progressive rate limit error:", error);
    return {
      success: false,
      remaining: 0,
      resetAt: Date.now() + 3600000,
      offense: -1,
    };
  }
}

// ──────────────────────────────────────────────────────────────
// MIDDLEWARE INTEGRATION
// ──────────────────────────────────────────────────────────────

/**
 * Extract client IP from request headers (handles proxies)
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Check if request should bypass rate limiting
 */
export function shouldBypassRateLimit(pathname: string): boolean {
  const bypassPaths = [
    "/api/health",
    "/api/status",
    "/public/",
    "/assets/",
    "/.well-known/",
  ];
  return bypassPaths.some((path) => pathname.startsWith(path));
}

/**
 * Get rate limit config for route
 */
export function getRateLimitConfig(
  pathname: string
): keyof typeof RATE_LIMIT_CONFIG {
  if (pathname.startsWith("/api/auth/")) return "auth";
  if (pathname.startsWith("/api/admin/")) return "admin";
  if (pathname.startsWith("/api/")) return "api";
  return "public";
}

/**
 * Main rate limit check function
 */
export async function checkRateLimit(
  request: NextRequest
): Promise<{
  allowed: boolean;
  response?: NextResponse;
  metadata?: {
    identifier: string;
    remaining: number;
    resetAt: number;
  };
}> {
  const pathname = new URL(request.url).pathname;

  // Bypass certain routes
  if (shouldBypassRateLimit(pathname)) {
    return { allowed: true };
  }

  const ip = getClientIP(request);
  const configKey = getRateLimitConfig(pathname);
  const config = RATE_LIMIT_CONFIG[configKey];

  // Use Redis rate limit (falls back to memory if Redis down)
  const result = await rateLimitRedis(`${configKey}:${ip}`, {
    max: config.max,
    windowSecs: config.windowSecs,
  });

  if (!result.success) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: "Too many requests",
          message: `Rate limit exceeded for ${configKey} endpoint`,
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((result.resetAt - Date.now()) / 1000)
            ),
            "X-RateLimit-Limit": String(config.max),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(
              Math.ceil(result.resetAt / 1000)
            ),
          },
        }
      ),
    };
  }

  return {
    allowed: true,
    metadata: {
      identifier: `${configKey}:${ip}`,
      remaining: result.remaining,
      resetAt: result.resetAt,
    },
  };
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  metadata?: { remaining: number; resetAt: number }
): NextResponse {
  if (metadata) {
    response.headers.set("X-RateLimit-Remaining", String(metadata.remaining));
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(metadata.resetAt / 1000))
    );
  }
  return response;
}

/**
 * Extract the best available client IP from a Next.js Request (or NextRequest).
 * Prefers x-real-ip (set by the proxy from the socket, harder to spoof) over
 * x-forwarded-for (potentially user-supplied).
 * Falls back to "unknown" when running in environments without headers.
 */
export function getRequestIp(request: Request): string {
  // x-real-ip is typically set by Nginx from the TCP socket address
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  // x-forwarded-for: use only when behind a controlled proxy that strips/rewrites it
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return 'unknown';
}

/**
 * Simple rate limit check for API routes (legacy signature)
 * @param identifier - Unique identifier (e.g., "auth:user@email.com")
 * @param max - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export async function checkRateLimitSimple(
  identifier: string,
  max: number,
  windowMs: number
): Promise<boolean> {
  const windowSecs = Math.floor(windowMs / 1000);
  const result = await rateLimitRedis(identifier, { max, windowSecs });
  return result.success;
}
