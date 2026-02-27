import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

if (process.env.NODE_ENV !== 'production') {
  console.log('[prisma] connecting to', dbUrl.replace(/:\/\/[^@]+@/, '://***@'));
}

function createClient() {
  const adapter = new PrismaPg({ connectionString: dbUrl! });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
