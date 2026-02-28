import { Agent, AgentContext } from './base';

export class FraudAgent extends Agent {
  async run() {
    // simple fraud scan: look for orders over a threshold
    try {
      const res = await fetch(`${this.ctx.workspace}/api/orders`);
      const orders = await res.json();
      const suspicious = orders.filter((o:any)=>o.total > 1000);
      return { checked: orders.length, suspicious: suspicious.length };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
