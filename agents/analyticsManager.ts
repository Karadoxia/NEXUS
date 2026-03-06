import { Agent, AgentContext } from './base';

export class AnalyticsManager extends Agent {
  async run() {
    // simple trend: count new orders last 24h vs previous
    try {
      const res = await fetch(`${this.ctx.workspace}/api/orders`);
      const orders = await res.json();
      const now = Date.now();
      const day = 24*60*60*1000;
      const recent = (orders.orders || orders).filter((o:any)=> new Date(o.date).getTime() > now-day).length;
      const previous = orders.length - recent;
      return { total: orders.length, recent, previous };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
