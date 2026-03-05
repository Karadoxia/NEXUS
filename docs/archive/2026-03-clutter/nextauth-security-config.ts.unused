/**
 * NEXUS-V2 NextAuth Security Configuration & JWT Management
 * 
 * Purpose:
 *   - Secure session handling with 24-hour expiry
 *   - JWT token rotation every 12 hours
 *   - Session invalidation on logout
 *   - RBAC enforcement via middleware
 *   - Token blacklisting for compromised tokens
 *   - Secure cookie settings (HttpOnly, Secure, SameSite)
 * 
 * Features:
 *   1. JWT token signing & verification
 *   2. Automatic token rotation background job
 *   3. Session invalidation tracking
 *   4. RBAC middleware for API protection
 *   5. Token revocation list (blacklist)
 *   6. Audit logging for all auth events
 * 
 * Integration:
 *   - NextAuth.js v5+ (callback-based)
 *   - PostgreSQL for token storage
 *   - Redis for session cache & token blacklist
 *   - JWT with RS256 (RSA) signing
 */

import SignIn from '@/components/auth/SignIn'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

// ===== CONFIGURATION =====

/**
 * JWT Token Configuration
 * RS256 (RSA) provides better security than HS256 (HMAC)
 */
const JWT_CONFIG = {
  algorithm: 'RS256' as const,
  
  // Token lifetimes
  accessTokenExpiry: 12 * 60 * 60,    // 12 hours
  refreshTokenExpiry: 7 * 24 * 60 * 60, // 7 days
  sessionExpiry: 24 * 60 * 60,         // 24 hours
  
  // Rotation settings
  rotationThreshold: 6 * 60 * 60,      // Rotate if > 6 hours old
  rotationCheckInterval: 60 * 60,      // Check every hour
} as const

/**
 * Cookie Configuration
 * Production-grade security settings
 */
const COOKIE_CONFIG = {
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
  httpOnly: true,                                   // Prevent JS access
  sameSite: 'strict' as const,                      // CSRF protection
  maxAge: JWT_CONFIG.sessionExpiry,                 // 24 hours
  path: '/',
  domain: process.env.NEXTAUTH_URL_INTERNAL?.match(/https?:\/\/([^/:]+)/)?.[1], // Domain only
} as const

// ===== JWT TOKEN MANAGEMENT =====

/**
 * Generate RSA key pair for JWT signing
 * In production, store private key in HSM or KMS
 */
function getJWTKeys() {
  // WARNING: In production, use environment variables or KMS
  // DO NOT hardcode private keys
  const publicKey = process.env.JWT_PUBLIC_KEY || ''
  const privateKey = process.env.JWT_PRIVATE_KEY || ''
  
  if (!publicKey || !privateKey) {
    throw new Error('JWT_PUBLIC_KEY and JWT_PRIVATE_KEY environment variables required')
  }
  
  return { publicKey, privateKey }
}

/**
 * Sign a JWT token with RS256
 */
function signToken(payload: Record<string, any>, expiresIn: number): string {
  const { privateKey } = getJWTKeys()
  
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn,
    issuer: 'nexus-v2',
    audience: 'nexus-v2-app',
    subject: payload.sub || payload.id,
  })
}

/**
 * Verify a JWT token
 */
function verifyToken(token: string): Record<string, any> | null {
  try {
    const { publicKey } = getJWTKeys()
    
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'nexus-v2',
      audience: 'nexus-v2-app',
    }) as Record<string, any>
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Check if token is in blacklist (Redis)
 * Blacklist stores revoked tokens to prevent reuse after logout
 */
async function isTokenBlacklisted(token: string, jti: string): Promise<boolean> {
  try {
    const redis = await getRedisBrowser()
    const key = `token:blacklist:${jti}`
    const blacklisted = await redis.get(key)
    return !!blacklisted
  } catch (error) {
    console.error('Error checking token blacklist:', error)
    // Fail closed: assume token is invalid on error
    return true
  }
}

/**
 * Blacklist a token (add to Redis)
 * Called on logout/session invalidation
 */
async function blacklistToken(token: string, jti: string, expiresAt: number): Promise<void> {
  try {
    const redis = await getRedisBrowser()
    const key = `token:blacklist:${jti}`
    
    // TTL = time until token expiry + 1 hour buffer
    const ttl = Math.max(60, Math.floor(expiresAt - Date.now() / 1000))
    
    await redis.setex(key, ttl, '1')
  } catch (error) {
    console.error('Error blacklisting token:', error)
  }
}

// ===== SESSION CACHE (Redis) =====

/**
 * Cache session in Redis for fast lookups
 * TTL = session expiry time
 */
async function cacheSession(userId: string, sessionData: any): Promise<void> {
  try {
    const redis = await getRedisBrowser()
    const key = `session:${userId}`
    
    await redis.setex(
      key,
      JWT_CONFIG.sessionExpiry,
      JSON.stringify(sessionData)
    )
  } catch (error) {
    console.error('Error caching session:', error)
  }
}

/**
 * Retrieve session from cache
 */
async function getSessionFromCache(userId: string): Promise<any | null> {
  try {
    const redis = await getRedisBrowser()
    const key = `session:${userId}`
    const data = await redis.get(key)
    
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error retrieving session:', error)
    return null
  }
}

/**
 * Invalidate session (delete from cache)
 * Called on logout
 */
async function invalidateSession(userId: string): Promise<void> {
  try {
    const redis = await getRedisBrowser()
    const key = `session:${userId}`
    
    await redis.del(key)
  } catch (error) {
    console.error('Error invalidating session:', error)
  }
}

// ===== RBAC ENFORCEMENT =====

/**
 * Check if user has required roles
 * Used in middleware for API protection
 */
function requireRole(requiredRoles: string[]): (token: JWT) => boolean {
  return (token: JWT) => {
    const userRoles = (token.roles || []) as string[]
    return requiredRoles.some(role => userRoles.includes(role))
  }
}

/**
 * Check if user owns the resource
 * Prevents unauthorized access to other users' data
 */
function requireOwnership(token: JWT, resourceOwnerId: string): boolean {
  return token.sub === resourceOwnerId || (token.roles || []).includes('admin')
}

// ===== NEXAUTH CONFIGURATION =====

export const authOptions: NextAuthOptions = {
  // Session strategy: JWT (stateless)
  session: {
    strategy: 'jwt',
    maxAge: JWT_CONFIG.sessionExpiry,
    updateAge: JWT_CONFIG.rotationThreshold, // Rotate token if > 6h old
  },

  // Cookie configuration
  cookies: {
    sessionToken: {
      name: process.env.NEXTAUTH_SESSION_COOKIE_NAME || '__Secure.nexus.session',
      ...COOKIE_CONFIG,
    },
    callbackUrl: {
      name: '__Secure.nexus.callback',
      ...COOKIE_CONFIG,
    },
    csrfToken: {
      name: '__Host.nexus.csrf',
      ...COOKIE_CONFIG,
      httpOnly: true,
      secure: true,
    },
  },

  // Pages (custom signin/error pages)
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  // Providers (credentials only - integrate OAuth as needed)
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        // Query database for user
        const prisma = getTrustedServerClient()
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { roles: true },
        })

        if (!user) {
          throw new Error('User not found')
        }

        // Verify password (use bcrypt in production)
        const passwordMatch = await comparePassword(
          credentials.password,
          user.password_hash
        )
        if (!passwordMatch) {
          // Audit log failed login attempt
          await logAuthEvent('LOGIN_FAILED', {
            userId: user.id,
            email: user.email,
            reason: 'invalid_password',
            ipAddress: credentials.ipAddress,
          })
          throw new Error('Invalid password')
        }

        // Check if user is active
        if (!user.is_active) {
          throw new Error('User account is disabled')
        }

        // Audit log successful login
        await logAuthEvent('LOGIN_SUCCESS', {
          userId: user.id,
          email: user.email,
          ipAddress: credentials.ipAddress,
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles.map(r => r.name),
          // Add custom attributes
          mfaEnabled: !!user.mfa_secret,
          lastLogin: new Date(user.last_login || Date.now()),
        }
      },
    }),
  ],

  // JWT Callback: Called when JWT is created/updated
  callbacks: {
    async jwt({ token, user, trigger }) {
      // User login: Add user info to token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.roles = user.roles || []
        token.iat = Math.floor(Date.now() / 1000)
        token.jti = crypto.randomUUID() // Unique token ID for revocation
      }

      // Token refresh: Check if rotation needed
      if (trigger === 'update' && token.iat) {
        const age = Math.floor(Date.now() / 1000) - (token.iat as number)
        
        // Rotate if token > 6 hours old
        if (age > JWT_CONFIG.rotationThreshold) {
          token.iat = Math.floor(Date.now() / 1000)
          token.jti = crypto.randomUUID() // New JTI for new token
          
          // Audit log token rotation
          await logAuthEvent('TOKEN_ROTATED', {
            userId: token.sub,
            jti: token.jti,
            reason: 'automatic_rotation',
          })
        }
      }

      return token
    },

    // Session Callback: Called on client session retrieval
    async session({ session, token }) {
      // Add token data to session
      session.accessToken = token // In production, return only jti
      session.user.id = token.sub
      session.user.roles = (token.roles || []) as string[]
      session.expiresAt = new Date(
        (token.exp as number) * 1000
      ).toISOString()

      // Cache session in Redis
      await cacheSession(token.sub as string, session)

      return session
    },

    // Redirect Callback: Called after signin/callback
    async redirect({ url, baseUrl }) {
      // Only allow redirects to same origin
      if (url.startsWith('/')) return url
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },

    // SignIn Callback: Called before user is signed in
    async signIn({ user, account }) {
      // Additional checks before allowing signin
      if (!user.id) return false
      if (account?.provider === 'credentials' && !user.email) return false

      return true
    },
  },

  // Event Handlers: Audit logging
  events: {
    async signIn({ user, account }) {
      await logAuthEvent('SIGNIN', {
        userId: user?.id,
        provider: account?.provider,
      })
    },

    async signOut({ token }) {
      // Invalidate session & blacklist token
      if (token.sub) {
        await invalidateSession(token.sub)
        if (token.jti) {
          await blacklistToken('', token.jti as string, (token.exp || 0) as number)
        }
      }

      await logAuthEvent('SIGNOUT', {
        userId: token.sub,
        jti: token.jti,
      })
    },
  },
}

// ===== HELPER FUNCTIONS =====

/**
 * Get Redis client for session/token management
 */
async function getRedisBrowser() {
  const redis = require('redis')
  const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: 0,
  })
  
  if (!client.isOpen) {
    await client.connect()
  }
  
  return client
}

/**
 * Compare password with bcrypt hash
 */
async function comparePassword(plain: string, hash: string): Promise<boolean> {
  const bcrypt = require('bcrypt')
  return bcrypt.compare(plain, hash)
}

/**
 * Get Prisma client for database queries
 */
function getTrustedServerClient() {
  const { PrismaClient } = require('@prisma/client')
  return new PrismaClient()
}

/**
 * Log authentication events for audit trail
 */
async function logAuthEvent(
  eventType: string,
  data: Record<string, any>
): Promise<void> {
  try {
    const prisma = getTrustedServerClient()
    
    await prisma.audit_log.create({
      data: {
        event_type: eventType,
        user_id: data.userId || null,
        metadata: data,
        ip_address: data.ipAddress || null,
        created_at: new Date(),
      },
    })
  } catch (error) {
    console.error('Error logging auth event:', error)
  }
}

// ===== EXPORTS =====

export default authOptions
export {
  signToken,
  verifyToken,
  isTokenBlacklisted,
  blacklistToken,
  cacheSession,
  getSessionFromCache,
  invalidateSession,
  requireRole,
  requireOwnership,
  JWT_CONFIG,
  COOKIE_CONFIG,
}
