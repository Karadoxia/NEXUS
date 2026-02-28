import { Agent, AgentContext } from './base';

export class CustomerExperienceManager extends Agent {
  async run() {
    // fetch support tickets and compute open count
    try {
      const res = await fetch(`${this.ctx.workspace}/api/support`);
      const tickets = res.ok ? await res.json() : [];
      const open = tickets.filter((t:any)=>t.status!=='closed').length;
      return { total: tickets.length, open };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
