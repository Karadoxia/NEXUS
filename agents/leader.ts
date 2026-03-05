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
import { MarketingOptimizer } from './marketingOptimizer';
import { StockForecaster } from './stockForecaster';
import { Reporter } from './reporter';

export class Leader extends Agent {
  /** Run an agent safely — a failure in one agent must not abort the full cycle. */
  private async runAgent(label: string, agent: { run: () => Promise<unknown> }, report: Reporter) {
    try {
      const data = await agent.run();
      await report.run({ type: label, data });
    } catch (err) {
      console.error(`[Leader] agent "${label}" failed`, err);
      await report.run({ type: label, data: { error: String(err) } });
    }
  }

  async run() {
    const report = new Reporter(this.ctx);

    await this.runAgent('operations',           new OperationsManager(this.ctx),      report);
    await this.runAgent('orders',               new OrderProcessor(this.ctx),         report);
    await this.runAgent('stock',                new StockManager(this.ctx),           report);
    await this.runAgent('finance',              new FinanceManager(this.ctx),         report);
    await this.runAgent('customer',             new CustomerExperienceManager(this.ctx), report);
    await this.runAgent('marketing',            new MarketingManager(this.ctx),       report);
    await this.runAgent('analytics',            new AnalyticsManager(this.ctx),       report);
    await this.runAgent('qa',                   new QAAgent(this.ctx),                report);
    await this.runAgent('negotiation',          new NegotiationAgent(this.ctx),       report);
    await this.runAgent('fraud',                new FraudAgent(this.ctx),             report);
    await this.runAgent('returns',              new ReturnsAgent(this.ctx),           report);
    await this.runAgent('performance-analysis', new PerformanceAnalyzer(this.ctx),    report);
    await this.runAgent('marketing-opt',        new MarketingOptimizer(this.ctx),     report);
    await this.runAgent('stock-forecast',       new StockForecaster(this.ctx),        report);
    await this.runAgent('procurement',          new ProcurementAgent(this.ctx),       report);
    await this.runAgent('sav',                  new SAVAgent(this.ctx),               report);
    await this.runAgent('supplychain',          new SupplyChainAgent(this.ctx),       report);
    await this.runAgent('supplychain-manager',  new SupplyChainManager(this.ctx),     report);
    await this.runAgent('it',                   new ITAgent(this.ctx),                report);

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
        fs.writeFileSync(
          require('path').join(__dirname, '..', 'agents', 'config.json'),
          JSON.stringify(this.ctx.config, null, 2),
        );
      } catch (historyErr) {
        console.warn('[Leader] could not analyse history', historyErr);
      }

      // if returns exceed 10% of orders, flag it in config
      if (Array.isArray(orders) && orders.length > 0 &&
          Array.isArray(returns) && returns.length / orders.length > 0.1) {
        console.log('[Leader] high return rate detected, adjusting config');
        this.ctx.config.highReturnWarning = true;
        fs.writeFileSync(
          require('path').join(__dirname, '..', 'agents', 'config.json'),
          JSON.stringify(this.ctx.config, null, 2),
        );
      }
      return { orders: orders.length, returns: returns.length };
    } catch (err) {
      console.warn('[Leader] selfImprove failed', err);
      throw err;
    }
  }
}
