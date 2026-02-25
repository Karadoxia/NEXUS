import { Agent, AgentContext } from './base';

export class StockManager extends Agent {
  async run() {
    // query products and compute low-stock using a configurable threshold
    const res = await fetch(`${this.ctx.workspace}/api/products`);
    const products = await res.json();
    const threshold = this.ctx.config?.lowStockThreshold ?? 5;
    const low = products.filter((p:any)=>p.stock < threshold);
    return { lowStock: low, threshold, checked: new Date().toISOString() };
  }
}
