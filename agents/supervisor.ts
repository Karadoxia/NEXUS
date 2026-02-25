import fetch from 'node-fetch';
import { Agent, AgentContext } from './base';
import { Leader } from './leader';
import fs from 'fs';

/**
 * SupervisorAgent watches the health of the storefront and ensures the rest of
 * the agentic system is kicked back into life if the site becomes unreachable.
 * It also records downtime, sends alerts, and can restart auxiliary services.
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

      // record an outage in the performance table
      await this.logPerformance({ orders: 0, returns: 0, downtime: true, notes: err.message });

      // send a Slack alert if we have a webhook
      if (this.ctx.config?.slackWebhook) {
        try {
          await fetch(this.ctx.config.slackWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: `:rotating_light: NEXUS storefront unreachable: ${err.message}` }),
          });
        } catch (slackErr) {
          console.warn('[Supervisor] failed to send Slack alert', slackErr);
        }
      }

      // attempt to restart any auxiliary services (placeholder)
      try {
        this.restartServices();
      } catch (svcErr) {
        console.warn('[Supervisor] service restart failed', svcErr);
      }

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

  private async logPerformance(entry: { orders: number; returns: number; downtime: boolean; notes?: string }) {
    try {
      // we can use fetch to call an API route that writes to the DB
      await fetch(`${this.ctx.workspace}/api/agents/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (e) {
      console.warn('[Supervisor] failed to log performance', e);
    }
  }

  private restartServices() {
    // placeholder: in a real deployment you might invoke systemctl, docker
    // commands, or call out to a process manager. Here we'll just log.
    console.log('[Supervisor] restarting auxiliary services (noop)');
  }
}
