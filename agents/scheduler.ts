import cron from 'node-cron';
import { Leader } from './leader';

export function startScheduler(ctx: any) {
  // run leader every hour
  cron.schedule('0 * * * *', async () => {
    const leader = new Leader(ctx);
    const res = await leader.run();
    console.log('[scheduler] leader run finished', res);
  });
}
