/**
 * Lightweight in-memory rate limiter.
 * Not suitable for multi-process / clustered deployments — use Redis there.
 */

interface Entry {
  count: number;
  reset: number;
}

const store = new Map<string, Entry>();

/**
 * Returns true if the request is within the limit, false if it should be
 * rejected (HTTP 429).
 *
 * @param key      - Unique bucket key (e.g. `"auth:<ip>"`, `"newsletter:<ip>"`)
 * @param limit    - Max allowed requests per window
 * @param windowMs - Window length in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

/**
 * Extract the best available client IP from a Next.js Request (or NextRequest).
 * Falls back to "unknown" when running in environments without headers.
 */
export function getRequestIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
