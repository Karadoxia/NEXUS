import { Agent, AgentContext } from './base';

export class CustomerExperienceManager extends Agent {
  async run() {
    // fetch support tickets and compute open count
    try {
      const res = await fetch(`${this.ctx.workspace}/api/support`);
      const tickets = res.ok ? await res.json() : [];
      const ticketsData = (tickets.tickets || tickets);
      const open = ticketsData.filter((t: any) => t.status !== 'closed').length;
      const total = ticketsData.length;
      return { total, open };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
