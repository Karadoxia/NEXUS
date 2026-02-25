import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// globalThis is typed as any so we cast to avoid TS errors
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// ensure we convert relative sqlite URL to absolute path so the
// directory is always resolvable regardless of the current working directory.
let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
if (dbUrl.startsWith('file:')) {
  const p = dbUrl.slice(5);
  const abs = require('path').resolve(process.cwd(), p);
  dbUrl = `file:${abs}`;
}
const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
});

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({
    log: ['query'],
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
