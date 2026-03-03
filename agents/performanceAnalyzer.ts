import fetch from 'node-fetch';
import { Agent } from './base';

type PerformanceEntry = {
  returns: number;
  orders: number;
  notes?: string;
};

export class PerformanceAnalyzer extends Agent {
  async run() {
    // fetch past performance entries
    try {
      const res = await fetch(`${this.ctx.workspace}/api/agents/performance`);
      const entries: any = await res.json();
      const count = (entries.data || entries).length;
      const recent = (entries.data || entries).slice(0, 10);
      const avgReturns = (entries.data || entries).reduce((sum: number, e: PerformanceEntry) => sum + e.returns, 0) / (count || 1);

      // simple recommendation: if avgReturns > 10% of avg orders, raise return warning
      let recommendation = null;
      if (count) {
        const avgOrders = (entries.data || entries).reduce((sum: number, e: PerformanceEntry) => sum + e.orders, 0) / count;
        if (avgOrders > 0 && avgReturns / avgOrders > 0.1) {
          recommendation = 'Consider tightening quality controls or restocking fewer items.';
        }
      }

      // another recommendation: if many low-stock alerts in history increase threshold
      const lowCount = (entries.data || entries).filter((e: PerformanceEntry) => e.notes && e.notes.includes('low-stock')).length;
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
      return { error: typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e) };
    }
  }
}
