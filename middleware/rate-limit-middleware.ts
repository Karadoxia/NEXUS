/**
 * ══════════════════════════════════════════════════════════════
 * RATE LIMIT MIDDLEWARE — Integration with Next.js middleware
 * Applies rate limiting to all API routes before auth checks
 * Status: Ready to integrate into middleware.ts
 * ══════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIP,
  addRateLimitHeaders,
} from "@/lib/rate-limit";

/**
 * Rate Limit Middleware
 * Call this EARLY in middleware.ts before auth/RBAC checks
 * Order: Rate limit → Auth → RBAC → Route handler
 */
export async function rateLimitMiddleware(request: NextRequest) {
  // Check rate limit
  const limitCheck = await checkRateLimit(request);

  if (!limitCheck.allowed) {
    // Rate limit exceeded — return 429
    const response = limitCheck.response || new NextResponse(null);
    return response;
  }

  // Add rate limit headers to response (for client consumption)
  // Note: Response headers are added in the route handler, not here
  return NextResponse.next();
}

/**
 * Example integration into middleware.ts:
 *
 * ```typescript
 * import { rateLimitMiddleware } from "@/middleware/rate-limit";
 *
 * export async function middleware(request: NextRequest) {
 *   // Step 1: Rate limiting (fast, early exit if limit exceeded)
 *   const rateLimitResult = await rateLimitMiddleware(request);
 *   if (!rateLimitResult.ok || rateLimitResult.status === 429) {
 *     return rateLimitResult;
 *   }
 *
 *   // Step 2: Authentication & RBAC
 *   const authResult = await authMiddleware(request);
 *   // ... etc
 * }
 * ```
 */

/**
 * Alternative: Simpler integration if you want rate limiting on specific routes only
 */
export async function rateLimitProtected(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  // Rate limit check
  const check = await checkRateLimit(request);
  if (!check.allowed) {
    return check.response!;
  }

  // Call the actual route handler
  const response = await handler(request);

  // Add rate limit headers
  if (check.metadata) {
    addRateLimitHeaders(response, {
      remaining: check.metadata.remaining,
      resetAt: check.metadata.resetAt,
    });
  }

  return response;
}

/**
 * Export for direct use in route handlers
 */
export { checkRateLimit, getClientIP, addRateLimitHeaders };
