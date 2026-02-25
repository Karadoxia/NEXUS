import { Agent, AgentContext } from './base';

export class SAVAgent extends Agent {
  async run() {
    // customer service tickets handling
    // stub: fetch from a hypothetical /api/support
    try {
      const res = await fetch(`${this.ctx.workspace}/api/support`);
      if (res.ok) return await res.json();
    } catch {}
    return { tickets: [] };
  }
}
