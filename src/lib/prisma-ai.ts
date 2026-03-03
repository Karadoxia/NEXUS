// ============================================================
// NEXUS AI DATABASE CLIENT
// File: src/lib/prisma-ai.ts
//
// Purpose: Singleton Prisma client for the dedicated AI/ML database
// This is separate from the main nexus_v2 commerce database
// ============================================================

import { PrismaClient } from '../.prisma/client-ai';

// Validate AI_DATABASE_URL is set at module load time
if (!process.env.AI_DATABASE_URL) {
  console.error('[prisma-ai] FATAL: AI_DATABASE_URL environment variable is not set');
  console.error('[prisma-ai] This is required for ML features to work');
  console.error('[prisma-ai] Set AI_DATABASE_URL in your .env or docker-compose.yml');
  // In development, throw error immediately. In production, continue with warnings.
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
      'AI_DATABASE_URL environment variable is not set. ' +
      'AI/ML features will not work. ' +
      'Please set AI_DATABASE_URL in your .env or docker-compose.yml'
    );
  }
}

declare global {
  var prismaAI: PrismaClient | undefined;
}

export const getPrismaAI = (): PrismaClient => {
  if (!global.prismaAI) {
    global.prismaAI = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  return global.prismaAI;
};

export const prismaAI = getPrismaAI();

// Ensure client disconnects on app shutdown
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await prismaAI.$disconnect();
    process.exit(0);
  });
}
