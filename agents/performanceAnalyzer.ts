import fetch from 'node-fetch';
import { Agent, AgentContext } from './base';

export class PerformanceAnalyzer extends Agent {
  async run() {
    // fetch past performance entries
    try {
      const res = await fetch(`${this.ctx.workspace}/api/agents/performance`);
      const entries = await res.json();
      const count = entries.length;
      const recent = entries.slice(0, 10);
      const avgReturns = entries.reduce((sum:any, e:any) => sum + e.returns, 0) / (entries.length || 1);

      // simple recommendation: if avgReturns > 10% of avg orders, raise return warning
      let recommendation = null;
      if (entries.length) {
        const avgOrders = entries.reduce((sum:any, e:any) => sum + e.orders, 0) / entries.length;
        if (avgOrders > 0 && avgReturns / avgOrders > 0.1) {
          recommendation = 'Consider tightening quality controls or restocking fewer items.';
        }
      }

      // another recommendation: if many low-stock alerts in history increase threshold
      const lowCount = entries.filter((e:any) => e.notes && e.notes.includes('low-stock')).length;
      if (lowCount > 5) {
        // suggest raising low stock threshold
        this.ctx.config.lowStockThreshold = (this.ctx.config.lowStockThreshold || 5) + 2;
        recommendation = recommendation
          ? recommendation + ' Also raised low-stock threshold.'
          : 'Raised low-stock threshold due to repeated shortages.';
      }

      return { entriesCount: count, recent, avgReturns, recommendation, config: this.ctx.config };
    } catch (e) {
      console.warn('[PerformanceAnalyzer] failed', e);
      return { error: e.message };
    }
  }
}
