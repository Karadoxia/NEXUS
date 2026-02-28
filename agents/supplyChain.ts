import { Agent } from './base';

export class SupplyChainAgent extends Agent {
  async run() {
    const delayPredicted = Math.random() < 0.2;
    const status: Record<string, string> = {
      status: 'ok',
      checkedAt: new Date().toISOString(),
    };
    if (delayPredicted) {
      status['prediction'] = 'delay expected due to high traffic';
    }
    return status;
  }
}
