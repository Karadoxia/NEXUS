/**
 * Lightweight in-memory rate limiter.
 * Not suitable for multi-process / clustered deployments — use Redis there.
 *
 * Security note: the `getRequestIp` helper reads `x-forwarded-for` which is
 * user-controllable unless your reverse proxy overwrites it from the socket
 * address (e.g. Nginx: `proxy_set_header X-Forwarded-For $remote_addr`).
 * Pair IP-based limits with per-credential limits for defence in depth.
 */

interface Entry {
  count: number;
  reset: number; // epoch ms when the window resets
}

const store = new Map<string, Entry>();

// Purge expired entries every 5 minutes so the map cannot grow without bound
// under sustained traffic with many unique keys.  `.unref()` prevents this
// timer from keeping the Node.js process alive when nothing else is running.
const _cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.reset) store.delete(key);
  }
}, 5 * 60 * 1000);

if (typeof _cleanup.unref === 'function') _cleanup.unref();

/**
 * Returns true if the request is within the limit, false if it should be
 * rejected (HTTP 429).
 *
 * @param key      - Unique bucket key (e.g. `"auth:<ip>"`, `"newsletter:<email>"`)
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
