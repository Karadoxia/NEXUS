import { startScheduler } from '../../agents/scheduler';

export function initAgents() {
  // allow disabling agents entirely (e.g. in local development when the
  // server is slow or unreachable). set DISABLE_AGENTS=true in env.
  if (process.env.DISABLE_AGENTS === 'true' || process.env.NODE_ENV === 'development') {
    console.log('[agents] disabled via environment');
    return;
  }

  // determine the base URL for calling our own API. prefer a public env var,
  // then the app URL or finally the current port (defaults to 3030 in dev).
  const workspace =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    `http://localhost:${process.env.PORT || 3030}`;

  const ctx = { workspace, config: { slackWebhook: process.env.SLACK_WEBHOOK } };
  startScheduler(ctx);
}
