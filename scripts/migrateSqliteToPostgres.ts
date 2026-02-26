import { PrismaClient } from '../src/generated/prisma/client';

// This script assumes DATABASE_URL points to Postgres and SQLITE_URL points to the
// existing dev.db (file:./dev.db). It will read all records from SQLite using a
// transient client and copy them into Postgres. Run once and then delete dev.db.

async function main() {
  // temporary sqlite client
  const sqlite = new PrismaClient({
    datasources: { db: { url: process.env.SQLITE_URL || 'file:./dev.db' } },
  });

  const pg = new PrismaClient(); // uses DATABASE_URL

  console.log('reading sqlite data...');
  const users = await sqlite.user.findMany({ include: { orders: true, addresses: true, paymentMethods: true } });
  for (const u of users) {
    const { id, createdAt, ...rest } = u;
    await pg.user.upsert({
      where: { email: u.email },
      update: rest,
      create: { ...rest, id, createdAt },
    });
  }
  console.log('copied users', users.length);

  const products = await sqlite.product.findMany();
  for (const p of products) {
    const { id, createdAt, ...rest } = p;
    await pg.product.upsert({ where: { slug: p.slug }, update: rest, create: { ...rest, id, createdAt } });
  }
  console.log('copied products', products.length);

  const orders = await sqlite.order.findMany({ include: { items: true } });
  for (const o of orders) {
    const { id, createdAt, ...rest } = o;
    await pg.order.upsert({ where: { id }, update: rest, create: { ...rest, id, createdAt } });
    for (const item of o.items) {
      await pg.cartItem.upsert({ where: { id: item.id }, update: item, create: item });
    }
  }
  console.log('copied orders', orders.length);

  // repeat for other models as needed...

  await sqlite.$disconnect();
  await pg.$disconnect();
  console.log('migration complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
