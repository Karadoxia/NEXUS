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

// If we're pointing at sqlite, convert to absolute path as before
if (dbUrl.startsWith('file:')) {
  let p = dbUrl.slice(5);
  if (!path.isAbsolute(p)) {
    const projectRoot = path.resolve(process.cwd());
    p = path.resolve(projectRoot, p);
  }
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  dbUrl = `file:${p}`;
}
if (process.env.NODE_ENV !== 'production') {
  console.log('[prisma] connecting to', dbUrl);
}

let adapter: any;
if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  // Prisma's client engine still expects an adapter object when using the
  // "client" engine type.  We provide a harmless empty object instead of
  // undefined to satisfy the constructor validation.
  adapter = {};
} else {
  adapter = new PrismaBetterSqlite3({
    url: dbUrl,
  });
}

// If you want a separate database connection for agent management, you
// can set AGENT_DATABASE_URL in env and create a second PrismaClient below.
// const agentDbUrl = process.env.AGENT_DATABASE_URL;
// export const agentPrisma = agentDbUrl ? new PrismaClient({
//   datasources: { db: { url: agentDbUrl } },
// }) : prisma;

const usingPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : [],
    ...(usingPostgres ? {} : { adapter }),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
