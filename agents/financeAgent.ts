import { prisma } from '@/src/lib/prisma';

export class FinanceAgent {
  ctx: any;
  constructor(ctx: any) {
    this.ctx = ctx;
  }

  async run() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const revenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { date: { gte: firstDay, lte: lastDay }, status: 'processing' },
    });
    const orderCount = await prisma.order.count({
      where: { date: { gte: firstDay, lte: lastDay } },
    });
    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      revenue: revenue._sum.total ?? 0,
      orderCount,
    };
  }
}
