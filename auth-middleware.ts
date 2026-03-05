/**
 * NEXUS-V2 Authentication & RBAC Middleware
 * 
 * Purpose:
 *   - Protect routes with JWT verification
 *   - Enforce RBAC on API endpoints
 *   - Validate token freshness & blacklist status
 *   - Rate limiting per user/IP
 *   - Request tracking & audit logging
 * 
 * Deployment:
 *   - NextAuth middleware.ts (Route Protection)
 *   - API middleware for token validation
 *   - RBAC checks in individual route handlers
 * 
 * Usage:
 *   // In middleware.ts
 *   export { auth as middleware } from '@/auth'
 *   export const config = { matcher: ['/api/:path*', '/dashboard/:path*'] }
 */

import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// ===== CONSTANTS =====

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/verify-email',
  '/health',
  '/api/health',
]

/**
 * Admin-only routes
 */
const ADMIN_ROUTES = [
  '/api/admin',
  '/dashboard/admin',
  '/dashboard/settings',
]

/**
 * Role-based route mappings
 */
const ROLE_REQUIRED_ROUTES: Record<string, string[]> = {
  '/api/workflows': ['workflow_admin', 'user'],
  '/api/alerts': ['alert_admin', 'user'],
  '/api/credentials': ['credential_admin'],
  '/api/users': ['user_admin'],
  '/api/reports': ['report_viewer', 'admin'],
  '/dashboard/workflows': ['workflow_admin', 'user'],
  '/dashboard/reports': ['report_viewer'],
}

/**
 * Rate limiting configuration (requests per minute)
 */
const RATE_LIMITS: Record<string, number> = {
  default: 60,           // 60 reqs/min for authenticated users
  admin: 120,           // 120 reqs/min for admins
  'api/auth': 10,       // 10 reqs/min for auth endpoints
  'api/credentials': 5, // 5 reqs/min for sensitive endpoints
}

// ===== RATE LIMITING =====

/**
 * In-memory rate limiter (for single-instance deployments)
 * For distributed: use Redis
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

/**
 * Check rate limit for user/IP
 */
function checkRateLimit(identifier: string, limit: number): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + 60000, // 1 minute window
    })
    return true
  }

  if (entry.count < limit) {
    entry.count++
    return true
  }

  return false
}

/**
 * Get rate limit key (user ID + endpoint or IP)
 */
function getRateLimitKey(request: NextRequest, userId?: string): string {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-client-ip') || 
             'unknown'
  
  return userId ? `user:${userId}` : `ip:${ip}`
}

// ===== AUTHENTICATION MIDDLEWARE =====

/**
 * Main authentication middleware
 * Validates JWT token, checks blacklist, enforces RBAC
 */
export async function authMiddleware(
  request: NextRequest,
  response: NextResponse
) {
  const { pathname } = new URL(request.url)

  // Skip public routes
  if (isPublicRoute(pathname)) {
    return response
  }

  // Get JWT token from cookie
  const token = request.cookies.get('__Secure.nexus.session')?.value

  if (!token) {
    return unauthorized(request, 'No session token')
  }

  try {
    // Verify JWT signature & expiry
    const verified = await verifyJWT(token)
    if (!verified) {
      return unauthorized(request, 'Invalid or expired token')
    }

    // Check if token is blacklisted
    const blacklisted = await checkBlacklist(verified.jti)
    if (blacklisted) {
      return unauthorized(request, 'Token has been revoked')
    }

    // Check token age (rotation check)
    const age = Math.floor(Date.now() / 1000) - verified.iat
    if (age > 6 * 60 * 60) {
      // Token is old - require refresh
      return unauthorized(request, 'Token needs refresh')
    }

    // Attach verified token to request
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', verified.sub)
    requestHeaders.set('x-user-roles', JSON.stringify(verified.roles || []))
    requestHeaders.set('x-token-jti', verified.jti)

    // Check rate limit
    const rateKey = getRateLimitKey(request, verified.sub)
    const roleLimit = verified.roles?.includes('admin') ? RATE_LIMITS.admin : RATE_LIMITS.default
    
    if (!checkRateLimit(rateKey, roleLimit)) {
      return rateLimitExceeded(request)
    }

    // Check RBAC for protected routes
    const rbacCheck = checkRBAC(pathname, verified.roles)
    if (!rbacCheck.allowed) {
      return forbidden(request, rbacCheck.reason)
    }

    // Log successful authentication
    logAuthEvent('AUTH_SUCCESS', {
      userId: verified.sub,
      pathname,
      roles: verified.roles,
      tokenAge: age,
    })

    // Create new response with attached headers
    const nextResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return nextResponse

  } catch (error) {
    console.error('Authentication middleware error:', error)
    return unauthorized(request, 'Authentication failed')
  }
}

// ===== RBAC ENFORCEMENT =====

/**
 * Check if user has required roles for route
 */
function checkRBAC(pathname: string, userRoles: string[] = []): {
  allowed: boolean
  reason?: string
} {
  // Admin routes
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/dashboard/admin')) {
    if (!userRoles.includes('admin')) {
      return { allowed: false, reason: 'Admin role required' }
    }
    return { allowed: true }
  }

  // Role-specific routes
  for (const [route, requiredRoles] of Object.entries(ROLE_REQUIRED_ROUTES)) {
    if (pathname.startsWith(route)) {
      const hasRole = userRoles.some(role => requiredRoles.includes(role))
      if (!hasRole) {
        return {
          allowed: false,
          reason: `One of these roles required: ${requiredRoles.join(', ')}`,
        }
      }
    }
  }

  return { allowed: true }
}

/**
 * Require specific roles in API route handler
 * Usage in route.ts: requireRoles(['admin', 'workflow_admin'])(request)
 */
export function requireRoles(allowedRoles: string[]) {
  return (request: NextRequest) => {
    const rolesHeader = request.headers.get('x-user-roles')
    
    if (!rolesHeader) {
      return nextResponse(401, 'No roles found')
    }

    const userRoles = JSON.parse(rolesHeader)
    const hasRole = allowedRoles.some(role => userRoles.includes(role))

    if (!hasRole) {
      return nextResponse(403, `Requires one of: ${allowedRoles.join(', ')}`)
    }

    return null // OK
  }
}

/**
 * Check resource ownership
 * Usage: checkOwnership(resource.userId, request)
 */
export function checkOwnership(resourceOwnerId: string, request: NextRequest): boolean {
  const userId = request.headers.get('x-user-id')
  const roles = JSON.parse(request.headers.get('x-user-roles') || '[]')

  // Owner or admin can access
  return resourceOwnerId === userId || roles.includes('admin')
}

// ===== JWT VERIFICATION =====

/**
 * Verify JWT signature & expiry
 * Uses JOSE library for JWE/JWS
 */
async function verifyJWT(token: string): Promise<any> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_PUBLIC_KEY || 'secret'
    )

    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/**
 * Check if token JTI is in blacklist
 */
async function checkBlacklist(jti: string): Promise<boolean> {
  try {
    // In production, check Redis
    const redis = await getRedisBrowser()
    const key = `token:blacklist:${jti}`
    const exists = await redis.exists(key)
    return !!exists
  } catch (error) {
    console.error('Blacklist check error:', error)
    // Fail closed: assume blacklisted on error
    return true
  }
}

// ===== ROUTE HELPERS =====

/**
 * Check if route is public (no auth required)
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if route requires admin role
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}

// ===== RESPONSE HELPERS =====

/**
 * Return 401 unauthorized
 */
function unauthorized(request: NextRequest, reason: string): NextResponse {
  console.warn(`Unauthorized request: ${reason}`, {
    url: request.url,
    method: request.method,
  })

  logAuthEvent('AUTH_DENIED', {
    reason,
    pathname: new URL(request.url).pathname,
  })

  return nextResponse(401, 'Unauthorized')
}

/**
 * Return 403 forbidden
 */
function forbidden(request: NextRequest, reason: string): NextResponse {
  console.warn(`Forbidden request: ${reason}`, {
    url: request.url,
    method: request.method,
  })

  logAuthEvent('RBAC_DENIED', {
    reason,
    userId: request.headers.get('x-user-id'),
    pathname: new URL(request.url).pathname,
  })

  return nextResponse(403, 'Forbidden')
}

/**
 * Return 429 rate limit exceeded
 */
function rateLimitExceeded(request: NextRequest): NextResponse {
  console.warn('Rate limit exceeded', {
    userId: request.headers.get('x-user-id'),
    url: request.url,
  })

  logAuthEvent('RATELIMIT_EXCEEDED', {
    userId: request.headers.get('x-user-id'),
    pathname: new URL(request.url).pathname,
  })

  return nextResponse(429, 'Too many requests')
}

/**
 * Create JSON response
 */
function nextResponse(status: number, message: string, data?: any): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: message, ...(data && { data }) }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

// ===== AUDIT LOGGING =====

/**
 * Log authentication & authorization events
 */
async function logAuthEvent(
  eventType: string,
  data: Record<string, any>
): Promise<void> {
  try {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH_EVENT] ${eventType}:`, data)
    }

    // Log to database in production
    if (process.env.NODE_ENV === 'production') {
      await fetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          data,
          timestamp: new Date().toISOString(),
        }),
      })
    }
  } catch (error) {
    console.error('Error logging auth event:', error)
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Get Redis client
 */
async function getRedisBrowser() {
  const redis = require('redis')
  const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  })
  if (!client.isOpen) await client.connect()
  return client
}

// ===== EXPORTS =====

export { authMiddleware, requireRoles, checkOwnership }
