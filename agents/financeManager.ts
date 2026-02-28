import { Agent, AgentContext } from './base';

export class FinanceManager extends Agent {
  async run() {
    // summarize today's revenue and handle refunds
    try {
      const res = await fetch(`${this.ctx.workspace}/api/orders`);
      const orders = await res.json();
      const revenue = orders.reduce((sum:any,o:any)=>sum+o.total,0);
      const refunds = orders.filter((o:any)=>o.status==='cancelled').length;
      return { revenue, refunds };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
