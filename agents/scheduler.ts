import cron from 'node-cron';
import { Leader } from './leader';
import { SupervisorAgent } from './supervisor';

export function startScheduler(ctx: any) {
  // immediately kick off a supervisor check when the scheduler starts
  (async () => {
    const sup = new SupervisorAgent(ctx);
    await sup.run();
  })();

  // health‑check the site every minute; if the site is down the supervisor
  // will attempt to re‑invoke the leader and log what happened. in development
  // we throttle this to every 5 minutes to avoid spamming the logs and slowing
  // the server.
  const scheduleSpec = process.env.NODE_ENV === 'development' ? '*/5 * * * *' : '* * * * *';
  cron.schedule(scheduleSpec, async () => {
    const sup = new SupervisorAgent(ctx);
    const res = await sup.run();
    console.log('[scheduler] supervisor run finished', res);
  });

  // run leader once an hour to manage the whole system
  cron.schedule('0 * * * *', async () => {
    const leader = new Leader(ctx);
    const res = await leader.run();
    console.log('[scheduler] leader run finished', res);

    // after every full cycle we allow the leader to self‑improve
    if (typeof (leader as any).selfImprove === 'function') {
      try {
        await (leader as any).selfImprove();
      } catch (e) {
        console.warn('[scheduler] leader self‑improvement failed', e);
      }
    }
  });
}
