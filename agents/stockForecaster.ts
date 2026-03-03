import fetch from 'node-fetch';
import { Agent } from './base';

export class StockForecaster extends Agent {
  async run() {
    try {
      // fetch product list to examine stock 
      const res = await fetch(`${this.ctx.workspace}/api/products`);
      const products = await res.json();
      // naive forecast: if any product sold out recently, suggest reorder
      const lowStock = (products.products || products).filter((p: any) => p.stock < (this.ctx.config.lowStockThreshold || 5));
      return { lowStockCount: lowStock.length, suggestions: lowStock.map((p: any) => p.slug) };
    } catch (e) {
      console.warn('[StockForecaster] error', e);
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }
}
