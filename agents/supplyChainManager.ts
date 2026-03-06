import { Agent, AgentContext } from './base';

export class SupplyChainManager extends Agent {
  async run() {
    // check product stock levels and suggest reorder
    try {
      const res = await fetch(`${this.ctx.workspace}/api/products`);
      const products = await res.json();
      const low = (products.products || products).filter((p: any) => p.stock < 10);
      const suggestions = low.map((p: any) => ({ id: p.id, slug: p.slug, needed: 50 - p.stock }));
      return { lowStock: low.length, suggestions };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
