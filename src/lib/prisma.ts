import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

if (process.env.NODE_ENV !== 'production') {
  console.log('[prisma] connecting to', dbUrl.replace(/:\/\/[^@]+@/, '://***@'));
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
    adapter: new PrismaPg(new Pool({ connectionString: dbUrl })),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
