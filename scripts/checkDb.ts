import { prisma } from '../lib/prisma.ts';

async function main() {
  try {
    await prisma.$connect();
    const tables: any = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()`;
    console.log('tables', tables);
  } catch (e) {
    console.error('db error', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();