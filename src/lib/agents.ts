import { startScheduler } from '../../agents/scheduler';

export function initAgents() {
  const ctx = { workspace: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3040', config: { slackWebhook: process.env.SLACK_WEBHOOK } };
  startScheduler(ctx);
}
