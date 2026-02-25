import { Agent, AgentContext } from './base';

export class Reporter extends Agent {
  async run(payload: any) {
    // default: log
    console.log('[REPORT]', payload);
    if (this.ctx.config?.slackWebhook) {
      try {
        await fetch(this.ctx.config.slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: JSON.stringify(payload).slice(0,1000) }),
        });
      } catch {}
    }
    return payload;
  }
}
