import fetch from 'node-fetch';
import { Agent, AgentContext } from './base';

export class MarketingOptimizer extends Agent {
  async run() {
    // look at recent performance and suggest budget adjustments
    try {
      const res = await fetch(`${this.ctx.workspace}/api/agents/performance`);
      const entries = await res.json();
      const last = entries[0] || { orders: 0 };
      let recommendation = 'hold';
      if (last.orders > 150) {
        recommendation = 'increase';
        this.ctx.config.marketingBudget = (this.ctx.config.marketingBudget || 0) + 1000;
      } else if (last.orders < 50) {
        recommendation = 'decrease';
        this.ctx.config.marketingBudget = Math.max((this.ctx.config.marketingBudget || 0) - 500, 0);
      }
      // persist config
      const fs = require('fs');
      fs.writeFileSync('agents/config.json', JSON.stringify(this.ctx.config, null, 2));
      return { recommendation, budget: this.ctx.config.marketingBudget };
    } catch (e) {
      console.warn('[MarketingOptimizer] error', e);
      return { error: e.message };
    }
  }
}
