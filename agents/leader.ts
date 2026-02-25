import { Agent, AgentContext } from './base';
import fetch from 'node-fetch';
import fs from 'fs';
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
import { PerformanceAnalyzer } from './performanceAnalyzer';
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

    // performance analysis (historical) and optimization suggestions
    const perfAnalyzer = new PerformanceAnalyzer(this.ctx);
    const perfReport = await perfAnalyzer.run();
    await report.run({ type: 'performance-analysis', data: perfReport });

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
      // persist the observation so the system has historical data
      try {
        await fetch(`${this.ctx.workspace}/api/agents/performance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: orders.length, returns: returns.length, downtime: false }),
        });
      } catch (e) {
        console.warn('[Leader] failed to persist performance metric', e);
      }

      // fetch past entries to guide config changes
      try {
        const histRes = await fetch(`${this.ctx.workspace}/api/agents/performance`);
        const history = await histRes.json();
        const avgOrders = history.reduce((sum:any, e:any) => sum + e.orders, 0) / (history.length || 1);
        const avgReturns = history.reduce((sum:any, e:any) => sum + e.returns, 0) / (history.length || 1);
        // example: if average orders exceed 100, increase marketing budget
        if (avgOrders > 100 && !this.ctx.config.marketingBudget) {
          console.log('[Leader] increasing marketing budget due to high demand');
          this.ctx.config.marketingBudget = 5000; // hypothetical units
        }
        // persist updated config
        fs.writeFileSync('agents/config.json', JSON.stringify(this.ctx.config, null, 2));
      } catch (historyErr) {
        console.warn('[Leader] could not analyse history', historyErr);
      }

      // simple config adjustment example: if returns > 10% of orders, flag
      if (orders > 0 && returns / orders > 0.1) {
        console.log('[Leader] high return rate detected, adjusting config');
        this.ctx.config.highReturnWarning = true;
        // in a real system you might write this to a DB or file here
        fs.writeFileSync('agents/config.json', JSON.stringify(this.ctx.config, null, 2));
      }
      return { orders: orders.length, returns: returns.length }; 
    } catch (err) {
      console.warn('[Leader] selfImprove failed', err);
      throw err;
    }
  }
}
