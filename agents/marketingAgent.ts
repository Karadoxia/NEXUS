import { prisma } from '@/src/lib/prisma';

export class MarketingAgent {
  ctx: any;
  constructor(ctx: any) {
    this.ctx = ctx;
  }

  async run() {
    // Find recently added products that may need promotion
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newProducts = await prisma.product.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { id: true, name: true, price: true, category: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const suggestions = newProducts.map(p => ({
      productId: p.id,
      name: p.name,
      promotionSuggested: true,
    }));
    return { suggestions, count: suggestions.length };
  }
}
