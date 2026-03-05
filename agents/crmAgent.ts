import { prismaAI } from '@/src/lib/prisma-ai';

export class CRMAgent {
  ctx: any;
  constructor(ctx: any) {
    this.ctx = ctx;
  }

  async run() {
    // Find users with recent orders to identify active customers
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await prismaAI.user.findMany({
      where: { orders: { some: { date: { gte: sevenDaysAgo } } } },
      select: { id: true, email: true, _count: { select: { orders: true } } },
      take: 50,
    });
    return { activeCustomers: activeUsers.length, sample: activeUsers.slice(0, 5) };
  }
}
