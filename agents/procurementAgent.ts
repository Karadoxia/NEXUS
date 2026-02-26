import { Agent } from './base';
import fetch from 'node-fetch';

export class ProcurementAgent extends Agent {
  async run() {
    try {
      // Example: fetch low stock products and suggest reorder
      const res = await fetch(`${this.ctx.workspace}/api/products?lowStock=true`);
      const products = await res.json();
      const suggestions = products.map((p: any) => ({
        product: p.name,
        reorderQty: Math.max(10, 50 - p.stock),
        supplier: p.brand || 'Default Supplier',
      }));
      return { suggestions, insight: suggestions.length ? 'Reorder suggested.' : 'Stock levels are healthy.' };
    } catch (e) {
      return { error: typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e) };
    }
  }
}
