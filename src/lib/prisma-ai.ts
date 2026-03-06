import { PrismaClient } from '../generated/prisma-ai';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrismaAI = global as unknown as { prismaAI?: PrismaClient };

const dbUrl = process.env.AI_DATABASE_URL;
if (!dbUrl) {
  throw new Error('AI_DATABASE_URL environment variable is not set');
}

if (process.env.NODE_ENV !== 'production') {
  console.log('[prisma-ai] connecting to', dbUrl.replace(/:\/\/[^@]+@/, '://***@'));
}

export const prismaAI =
  globalForPrismaAI.prismaAI ?? new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
    adapter: new PrismaPg(new Pool({ connectionString: dbUrl })),
  });

if (process.env.NODE_ENV !== 'production') globalForPrismaAI.prismaAI = prismaAI;
