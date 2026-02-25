import { Agent, AgentContext } from './base';

export class StockManager extends Agent {
  async run() {
    // query products and compute low-stock
    const res = await fetch(`${this.ctx.workspace}/api/products`);
    const products = await res.json();
    const low = products.filter((p:any)=>p.stock<5);
    return { lowStock: low, checked: new Date().toISOString() };
  }
}
