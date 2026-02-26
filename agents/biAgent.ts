import { Agent } from './base';
import fetch from 'node-fetch';

export class BiAgent extends Agent {
  async run() {
    // Example: fetch sales data and return a summary
    try {
      const res = await fetch(`${this.ctx.workspace}/api/agents/performance`);
      const entries = await res.json();
      const totalOrders = entries.reduce((sum, e) => sum + (e.orders || 0), 0);
      const totalReturns = entries.reduce((sum, e) => sum + (e.returns || 0), 0);
      const returnRate = totalOrders > 0 ? ((totalReturns / totalOrders) * 100).toFixed(1) : '0.0';
      const summary = {
        totalOrders,
        totalReturns,
        returnRate,
        insight: totalOrders > 0 ? `Return rate is ${returnRate}%.` : 'No orders yet.'
      };
      return summary;
    } catch (e) {
      return { error: typeof e === 'object' && e !== null && 'message' in e ? (e as { message: string }).message : String(e) };
    }
  }
}
