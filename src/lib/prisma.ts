import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// globalThis is typed as any so we cast to avoid TS errors
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// ensure sqlite url is converted to an absolute path based on the project
// root (rather than the runtime cwd which may change under Next.js). also
// create the directory if it doesn't exist so sqlite won't complain.
const path = require('path');
const fs = require('fs');
let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
if (dbUrl.startsWith('file:')) {
  let p = dbUrl.slice(5);
  if (!path.isAbsolute(p)) {
    // use current working directory as project root; this should be stable
    const projectRoot = path.resolve(process.cwd());
    p = path.resolve(projectRoot, p);
  }
  // ensure containing directory exists
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  dbUrl = `file:${p}`;
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
