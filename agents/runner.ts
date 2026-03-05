import 'ts-node/register';
import { Leader } from './leader';

async function main() {
  const ctx = { workspace: process.env.BASE_URL || 'http://localhost:3030', config: {} };
  const leader = new Leader(ctx as any);
  const res = await leader.run();
  console.log('leader result', res);
}

main().catch(console.error);
