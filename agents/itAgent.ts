import { Agent, AgentContext } from './base';

export class ITAgent extends Agent {
  async run() {
    // monitor system health, track communications
    // could aggregate logs, uptime, error rates
    const health = await fetch(`${this.ctx.workspace}/api/health`).then(r=>r.json()).catch(()=>null);
    const comms = await fetch(`${this.ctx.workspace}/api/communications`).then(r=>r.json()).catch(()=>[]);
    return { health, communications: comms };
  }
}
