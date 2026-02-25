import fetch from 'node-fetch';
import { Agent, AgentContext } from './base';
import { Leader } from './leader';

/**
 * SupervisorAgent watches the health of the storefront and ensures the rest of
 * the agentic system is kicked back into life if the site becomes unreachable.
 * It can also be extended with more advanced "self‑healing" or restart logic
 * later on.
 */
export class SupervisorAgent extends Agent {
  async run() {
    try {
      const res = await fetch(this.ctx.workspace, { method: 'GET' });
      if (!res.ok) {
        throw new Error(`unexpected status ${res.status}`);
      }
      console.log('[Supervisor] site healthy');
      return { status: 'healthy' };
    } catch (err: any) {
      console.error('[Supervisor] site unreachable, attempting recovery', err.message);

      // if the storefront is down, ask the leader to re‑run a full cycle
      try {
        const leader = new Leader(this.ctx);
        const recovery = await leader.run();
        console.log('[Supervisor] recovery leader run finished', recovery);
        return { status: 'recovered', recovery };
      } catch (ex) {
        console.error('[Supervisor] recovery attempt failed', ex);
        return { status: 'failed', error: ex };
      }
    }
  }
}
