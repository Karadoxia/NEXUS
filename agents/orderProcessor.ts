import { Agent, AgentContext } from './base';

export class OrderProcessor extends Agent {
  async run() {
    // fetch recent orders and do any post‑processing/sync
    const res = await fetch(`${this.ctx.workspace}/api/orders`);
    const orders = await res.json();
    // e.g., update statuses, trigger fulfillment, etc.
    return orders;
  }
}
