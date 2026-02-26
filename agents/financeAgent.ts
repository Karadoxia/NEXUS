import { prisma } from '@/src/lib/prisma';

export class FinanceAgent {
  ctx: any;
  constructor(ctx: any) {
    this.ctx = ctx;
  }

  async run() {
    // Example: Summarize monthly revenue and expenses
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const revenue = await prisma.invoice.aggregate({
      _sum: { amount: true },
      where: {
        paidAt: { gte: firstDay, lte: lastDay },
      },
    });
    const expenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: { gte: firstDay, lte: lastDay },
      },
    });
    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      revenue: revenue._sum.amount || 0,
      expenses: expenses._sum.amount || 0,
      profit: (revenue._sum.amount || 0) - (expenses._sum.amount || 0),
    };
  }
}
