import { Agent, AgentContext } from './base';

export class ReturnsAgent extends Agent {
  async run() {
    // handle simple returns: count orders with status cancelled
    try {
      const res = await fetch(`${this.ctx.workspace}/api/orders`);
      const orders = await res.json();
      const returns = (orders.orders || orders).filter((o:any)=>o.status === 'cancelled');
      return { total: orders.length, returns: returns.length };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
