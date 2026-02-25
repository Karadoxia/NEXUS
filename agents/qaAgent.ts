import { Agent, AgentContext } from './base';

export class QAAgent extends Agent {
  async run() {
    // placeholder for quality inspection logic
    // fetch products and flag ones without images/descriptions
    try {
      const res = await fetch(`${this.ctx.workspace}/api/products`);
      const products = await res.json();
      const issues = products.filter((p:any)=>!p.description || p.images?.length===0);
      return { total: products.length, issues: issues.length };
    } catch (e) {
      return { error: e.message };
    }
  }
}
