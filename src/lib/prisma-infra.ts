import { PrismaClient } from '../generated/prisma-infra';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const dbUrl = process.env.INFRA_DATABASE_URL;

if (process.env.NODE_ENV !== 'production' && dbUrl) {
    console.log('[prisma-infra] connecting to', dbUrl.replace(/:\/\/[^@]+@/, '://***@'));
}

// Next.js build-time safe wrapper
const pool = new Pool({ connectionString: dbUrl || 'postgresql://dummy:dummy@localhost:5432/dummy' });
const adapter = new PrismaPg(pool);

export const prismaInfra = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : [],
});
