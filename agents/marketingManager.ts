import { Agent, AgentContext } from './base';

export class MarketingManager extends Agent {
  async run() {
    // generate simple product recommendations by random
    try {
      const res = await fetch(`${this.ctx.workspace}/api/products`);
      const products = await res.json();
      const recs = (products.products || products).sort(()=>0.5-Math.random()).slice(0,3);
      return { recommendations: recs };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
