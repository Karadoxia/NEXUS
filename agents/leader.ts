import { Agent, AgentContext } from './base';
import fetch from 'node-fetch';
import { OrderProcessor } from './orderProcessor';
import { SupplyChainAgent } from './supplyChain';
import { SupplyChainManager } from './supplyChainManager';
import { StockManager } from './stockManager';
import { ProcurementAgent } from './procurement';
import { SAVAgent } from './savService';
import { ITAgent } from './itAgent';
import { OperationsManager } from './operationsManager';
import { FinanceManager } from './financeManager';
import { CustomerExperienceManager } from './customerExperienceManager';
import { MarketingManager } from './marketingManager';
import { AnalyticsManager } from './analyticsManager';
import { QAAgent } from './qaAgent';
import { NegotiationAgent } from './negotiationAgent';
import { FraudAgent } from './fraudAgent';
import { ReturnsAgent } from './returnsAgent';
import { Reporter } from './reporter';

export class Leader extends Agent {
  async run() {
    const report = new Reporter(this.ctx);

    // operations manager handles order intake/validation
    const ops = new OperationsManager(this.ctx);
    const opsReport = await ops.run();
    await report.run({ type: 'operations', data: opsReport });

    // coordinate order processing
    const orderAgent = new OrderProcessor(this.ctx);
    const orderResult = await orderAgent.run();
    await report.run({ type: 'orders', data: orderResult });

    // update inventory via stock manager
    const stock = new StockManager(this.ctx);
    const stockReport = await stock.run();
    await report.run({ type: 'stock', data: stockReport });

    // finance summary
    const fin = new FinanceManager(this.ctx);
    const finReport = await fin.run();
    await report.run({ type: 'finance', data: finReport });

    // customer experience overview
    const cx = new CustomerExperienceManager(this.ctx);
    const cxReport = await cx.run();
    await report.run({ type: 'customer', data: cxReport });

    // marketing recommendations
    const mk = new MarketingManager(this.ctx);
    const mkReport = await mk.run();
    await report.run({ type: 'marketing', data: mkReport });

    // analytics summary
    const an = new AnalyticsManager(this.ctx);
    const anReport = await an.run();
    await report.run({ type: 'analytics', data: anReport });

    // quality assurance check
    const qa = new QAAgent(this.ctx);
    const qaReport = await qa.run();
    await report.run({ type: 'qa', data: qaReport });

    // negotiation specialist
    const neg = new NegotiationAgent(this.ctx);
    const negReport = await neg.run();
    await report.run({ type: 'negotiation', data: negReport });

    // fraud detection
    const fraud = new FraudAgent(this.ctx);
    const fraudReport = await fraud.run();
    await report.run({ type: 'fraud', data: fraudReport });

    // returns handling
    const ret = new ReturnsAgent(this.ctx);
    const retReport = await ret.run();
    await report.run({ type: 'returns', data: retReport });

    // procurement checks
    const procurer = new ProcurementAgent(this.ctx);
    const procReport = await procurer.run();
    await report.run({ type: 'procurement', data: procReport });

    // service tickets
    const sav = new SAVAgent(this.ctx);
    const savReport = await sav.run();
    await report.run({ type: 'sav', data: savReport });

    // supply chain monitoring (status + reorder suggestions)
    const sc = new SupplyChainAgent(this.ctx);
    const scReport = await sc.run();
    await report.run({ type: 'supplychain', data: scReport });

    const scm = new SupplyChainManager(this.ctx);
    const scmReport = await scm.run();
    await report.run({ type: 'supplychain-manager', data: scmReport });

    // IT responsibilities
    const it = new ITAgent(this.ctx);
    const itReport = await it.run();
    await report.run({ type: 'it', data: itReport });

    // could spawn other workers…

    return 'leader done';
  }

  /**
   * A very simplistic self‑improvement placeholder. In a production system this
   * could query the database for historical KPIs, evaluate which strategies
   * worked best, and then update internal configuration or retrain models. For
   * now it just logs that the leader "learned" and persists a timestamp.
   */
  async selfImprove() {
    console.log('[Leader] running self‑improvement');
    try {
      // example metric: count total orders and returns
      const resp = await fetch(`${this.ctx.workspace}/api/orders`);
      const orders = await resp.json();
      const returnResp = await fetch(`${this.ctx.workspace}/api/orders?status=returned`);
      const returns = await returnResp.json();
      console.log(
        `[Leader] discovered ${orders.length} total orders, ${returns.length} returns`
      );
      // here you might update this.ctx.config or write to a db table
      return { orders: orders.length, returns: returns.length }; 
    } catch (err) {
      console.warn('[Leader] selfImprove failed', err);
      throw err;
    }
  }
}
