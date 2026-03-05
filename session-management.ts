/**
 * NEXUS-V2 Session Management & Token Rotation Service
 * 
 * Purpose:
 *   - Handle logout with session invalidation
 *   - Automatic background token rotation (every 12 hours)
 *   - Session monitoring & expiry detection
 *   - Device/session tracking
 *   - Concurrent session limiting
 * 
 * Usage:
 *   - Route: POST /api/auth/logout → invalidateSession()
 *   - Cron: Every 1 hour → rotateExpiredTokens()
 *   - Cron: Every 5 minutes → cleanupExpiredSessions()
 * 
 * Database Schema Required:
 *   - sessions table: id, user_id, token_jti, device_info, created_at, expires_at
 *   - token_rotation_log: id, user_id, old_jti, new_jti, rotated_at
 *   - active_devices: id, user_id, device_id, ip_address, last_seen, created_at
 */

import { jwtVerify, SignJWT } from 'jose'
import crypto from 'crypto'

// ===== CONFIGURATION =====

const SESSION_CONFIG = {
  // Session timeouts
  sessionMaxAge: 24 * 60 * 60,           // 24 hours
  tokenRotationInterval: 12 * 60 * 60,   // 12 hours
  tokenRotationThreshold: 6 * 60 * 60,   // Rotate if > 6h old
  
  // Concurrent sessions
  maxConcurrentSessions: 3,              // Max 3 active sessions per user
  
  // Cleanup
  cleanupInterval: 5 * 60,                // Check every 5 min
  maxIdleTime: 30 * 60,                   // 30 min idle timeout
  
  // Security
  requireIPMatch: false,                  // Enforce same IP for refresh
  requireDeviceMatch: true,               // Enforce same device for refresh
} as const

// ===== SESSION INVALIDATION =====

/**
 * Invalidate user session on logout
 * - Remove from session store
 * - Add JWT to blacklist
 * - Log logout event
 */
export async function invalidateSession(
  userId: string,
  jti: string,
  reason: string = 'user_logout'
): Promise<void> {
  try {
    const db = getTrustedDb()
    const redis = await getRedis()

    // 1. Delete session from database
    await db.session.deleteMany({
      where: { user_id: userId, token_jti: jti },
    })

    // 2. Add JWT to blacklist with TTL
    const blacklistKey = `token:blacklist:${jti}`
    const ttl = 24 * 60 * 60 // 24 hours
    await redis.setex(blacklistKey, ttl, '1')

    // 3. Remove from Redis session cache
    const sessionCacheKey = `session:${userId}:${jti}`
    await redis.del(sessionCacheKey)

    // 4. Log logout event
    await logSessionEvent({
      type: 'LOGOUT',
      user_id: userId,
      jti,
      reason,
      timestamp: new Date(),
    })

    console.log(`Session invalidated for user ${userId}`)
  } catch (error) {
    console.error('Error invalidating session:', error)
    throw error
  }
}

/**
 * Invalidate all sessions for a user
 * Used when password is changed or account compromised
 */
export async function invalidateAllUserSessions(
  userId: string,
  reason: string = 'user_requested'
): Promise<number> {
  try {
    const db = getTrustedDb()
    const redis = await getRedis()

    // 1. Get all active session JTIs
    const sessions = await db.session.findMany({
      where: { user_id: userId },
      select: { token_jti: true, expires_at: true },
    })

    // 2. Blacklist all tokens
    const now = Math.floor(Date.now() / 1000)
    for (const session of sessions) {
      const ttl = Math.max(60, 
        Math.floor((session.expires_at.getTime() / 1000) - now)
      )
      await redis.setex(
        `token:blacklist:${session.token_jti}`,
        ttl,
        '1'
      )
    }

    // 3. Delete all sessions
    const deleted = await db.session.deleteMany({
      where: { user_id: userId },
    })

    // 4. Clear Redis cache
    const pattern = `session:${userId}:*`
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }

    // 5. Log event
    await logSessionEvent({
      type: 'LOGOUT_ALL',
      user_id: userId,
      session_count: deleted.count,
      reason,
      timestamp: new Date(),
    })

    console.log(`Invalidated ${deleted.count} sessions for user ${userId}`)
    return deleted.count
  } catch (error) {
    console.error('Error invalidating all sessions:', error)
    throw error
  }
}

/**
 * Invalidate session by device ID
 * Used when user signs out from specific device
 */
export async function invalidateDeviceSession(
  userId: string,
  deviceId: string
): Promise<boolean> {
  try {
    const db = getTrustedDb()
    const redis = await getRedis()

    // Find active session for device
    const session = await db.session.findFirst({
      where: {
        user_id: userId,
        device_info: {
          contains: deviceId,
        },
      },
    })

    if (!session) {
      console.warn(`No session found for user ${userId}, device ${deviceId}`)
      return false
    }

    // Invalidate this session
    await invalidateSession(userId, session.token_jti, 'device_logout')
    
    // Remove device from active list
    await db.active_device.deleteMany({
      where: {
        user_id: userId,
        device_id: deviceId,
      },
    })

    return true
  } catch (error) {
    console.error('Error invalidating device session:', error)
    throw error
  }
}

// ===== TOKEN ROTATION =====

/**
 * Rotate JWT token for user
 * Called when token is > 6 hours old
 */
export async function rotateToken(
  userId: string,
  oldJti: string,
  deviceId: string
): Promise<string> {
  try {
    const db = getTrustedDb()
    const redis = await getRedis()

    // 1. Generate new JTI & token
    const newJti = crypto.randomUUID()
    const newToken = await generateNewToken(userId, newJti)

    // 2. Update session in database
    await db.session.update({
      where: { token_jti: oldJti },
      data: {
        token_jti: newJti,
        rotated_at: new Date(),
        expires_at: new Date(Date.now() + SESSION_CONFIG.sessionMaxAge * 1000),
      },
    })

    // 3. Update Redis cache
    const sessionKey = `session:${userId}:${newJti}`
    const sessionData = {
      userId,
      jti: newJti,
      deviceId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + SESSION_CONFIG.sessionMaxAge * 1000),
    }
    await redis.setex(
      sessionKey,
      SESSION_CONFIG.sessionMaxAge,
      JSON.stringify(sessionData)
    )

    // 4. Add old token to blacklist (grace period: 5 min)
    await redis.setex(`token:blacklist:${oldJti}`, 300, '1')

    // 5. Log rotation
    await logSessionEvent({
      type: 'TOKEN_ROTATED',
      user_id: userId,
      old_jti: oldJti,
      new_jti: newJti,
      device_id: deviceId,
      timestamp: new Date(),
    })

    console.log(`Token rotated for user ${userId}`)
    return newToken
  } catch (error) {
    console.error('Error rotating token:', error)
    throw error
  }
}

/**
 * Background job: Rotate expired/aging tokens
 * Run via cron: 0 * * * * (every hour)
 */
export async function rotateExpiredTokens(): Promise<number> {
  try {
    const db = getTrustedDb()
    const now = new Date()
    const rotationThresholdTime = new Date(
      now.getTime() - SESSION_CONFIG.tokenRotationThreshold * 1000
    )

    // Find sessions older than 6 hours
    const oldSessions = await db.session.findMany({
      where: {
        created_at: { lt: rotationThresholdTime },
        rotated_at: { lt: rotationThresholdTime },
      },
      select: { user_id: true, token_jti: true, device_info: true },
    })

    let rotated = 0

    for (const session of oldSessions) {
      try {
        const deviceInfo = JSON.parse(session.device_info || '{}')
        await rotateToken(session.user_id, session.token_jti, deviceInfo.deviceId)
        rotated++
      } catch (error) {
        console.error(`Failed to rotate session ${session.token_jti}:`, error)
      }
    }

    console.log(`Rotated ${rotated} tokens in background job`)
    return rotated
  } catch (error) {
    console.error('Error in token rotation job:', error)
    return 0
  }
}

// ===== SESSION CLEANUP =====

/**
 * Background job: Clean up expired sessions
 * Run via cron: every 5 minutes
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const db = getTrustedDb()
    const redis = await getRedis()

    // Find expired sessions
    const expired = await db.session.deleteMany({
      where: { expires_at: { lt: new Date() } },
    })

    // Clean up Redis cache for expired sessions
    const keys = await redis.keys('session:*')
    for (const key of keys) {
      const ttl = await redis.ttl(key)
      if (ttl < 0) {
        await redis.del(key)
      }
    }

    console.log(`Cleaned up ${expired.count} expired sessions`)
    return expired.count
  } catch (error) {
    console.error('Error cleaning up sessions:', error)
    return 0
  }
}

/**
 * Clean up old session logs (retention: 90 days)
 */
export async function cleanupOldSessionLogs(): Promise<number> {
  try {
    const db = getTrustedDb()
    const retentionDate = new Date()
    retentionDate.setDate(retentionDate.getDate() - 90)

    const deleted = await db.session_event_log.deleteMany({
      where: { timestamp: { lt: retentionDate } },
    })

    console.log(`Deleted ${deleted.count} old session logs`)
    return deleted.count
  } catch (error) {
    console.error('Error cleaning up session logs:', error)
    return 0
  }
}

// ===== CONCURRENT SESSION LIMITING =====

/**
 * Check & enforce max concurrent sessions
 * Called on successful login
 */
export async function enforceSessionLimit(userId: string): Promise<void> {
  try {
    const db = getTrustedDb()

    const activeSessions = await db.session.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
      select: { id: true, token_jti: true },
    })

    // If > max sessions, invalidate oldest
    if (activeSessions.length > SESSION_CONFIG.maxConcurrentSessions) {
      const toInvalidate = activeSessions.slice(
        0,
        activeSessions.length - SESSION_CONFIG.maxConcurrentSessions
      )

      for (const session of toInvalidate) {
        await invalidateSession(userId, session.token_jti, 'max_sessions_exceeded')
      }

      console.log(`Invalidated ${toInvalidate.length} old sessions for user ${userId}`)
    }
  } catch (error) {
    console.error('Error enforcing session limit:', error)
  }
}

/**
 * Track active devices for user
 * Called on successful login
 */
export async function trackDeviceSession(
  userId: string,
  jti: string,
  deviceInfo: {
    deviceId: string
    userAgent: string
    ipAddress: string
  }
): Promise<void> {
  try {
    const db = getTrustedDb()

    // Create or update active device
    await db.active_device.upsert({
      where: {
        user_id_device_id: {
          user_id: userId,
          device_id: deviceInfo.deviceId,
        },
      },
      create: {
        user_id: userId,
        device_id: deviceInfo.deviceId,
        device_name: deviceInfo.userAgent.split('/')[0],
        ip_address: deviceInfo.ipAddress,
        last_seen: new Date(),
        created_at: new Date(),
      },
      update: {
        ip_address: deviceInfo.ipAddress,
        last_seen: new Date(),
      },
    })

    // Store device info in session
    await db.session.update({
      where: { token_jti: jti },
      data: {
        device_info: JSON.stringify(deviceInfo),
      },
    })
  } catch (error) {
    console.error('Error tracking device session:', error)
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Generate new JWT token
 */
async function generateNewToken(userId: string, jti: string): Promise<string> {
  const secret = new TextEncoder().encode(
    process.env.JWT_PRIVATE_KEY || 'secret'
  )

  const token = await new SignJWT({
    sub: userId,
    jti,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

  return token
}

/**
 * Get database client
 */
function getTrustedDb() {
  const { PrismaClient } = require('@prisma/client')
  return new PrismaClient()
}

/**
 * Get Redis client
 */
async function getRedis() {
  const redis = require('redis')
  const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  })
  if (!client.isOpen) await client.connect()
  return client
}

/**
 * Log session event
 */
async function logSessionEvent(event: {
  type: string
  user_id?: string
  jti?: string
  old_jti?: string
  new_jti?: string
  device_id?: string
  session_count?: number
  reason?: string
  timestamp: Date
}): Promise<void> {
  try {
    const db = getTrustedDb()
    
    await db.session_event_log.create({
      data: {
        event_type: event.type,
        user_id: event.user_id || null,
        metadata: {
          jti: event.jti,
          old_jti: event.old_jti,
          new_jti: event.new_jti,
          device_id: event.device_id,
          reason: event.reason,
        },
        timestamp: event.timestamp,
      },
    })
  } catch (error) {
    console.error('Error logging session event:', error)
  }
}
