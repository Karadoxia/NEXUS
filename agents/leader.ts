import { Agent, AgentContext } from './base';
import { OrderProcessor } from './orderProcessor';
import { SupplyChainAgent } from './supplyChain';
import { StockManager } from './stockManager';
import { ProcurementAgent } from './procurement';
import { SAVAgent } from './savService';
import { ITAgent } from './itAgent';
import { Reporter } from './reporter';

export class Leader extends Agent {
  async run() {
    const report = new Reporter(this.ctx);

    // coordinate order processing
    const orderAgent = new OrderProcessor(this.ctx);
    const orderResult = await orderAgent.run();
    await report.run({ type: 'orders', data: orderResult });

    // update inventory via stock manager
    const stock = new StockManager(this.ctx);
    const stockReport = await stock.run();
    await report.run({ type: 'stock', data: stockReport });

    // procurement checks
    const procurer = new ProcurementAgent(this.ctx);
    const procReport = await procurer.run();
    await report.run({ type: 'procurement', data: procReport });

    // service tickets
    const sav = new SAVAgent(this.ctx);
    const savReport = await sav.run();
    await report.run({ type: 'sav', data: savReport });

    // supply chain monitoring
    const sc = new SupplyChainAgent(this.ctx);
    const scReport = await sc.run();
    await report.run({ type: 'supplychain', data: scReport });

    // IT responsibilities
    const it = new ITAgent(this.ctx);
    const itReport = await it.run();
    await report.run({ type: 'it', data: itReport });

    // could spawn other workers…

    return 'leader done';
  }
}
