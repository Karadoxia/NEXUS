console.log('script starting');
import { prisma } from './src/lib/prisma.ts';

async function main() {
  console.log('inside main');
  try {
    const count = await prisma.user.count();
    console.log('user count:', count);
  } catch (e) {
    console.error('error querying users:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
