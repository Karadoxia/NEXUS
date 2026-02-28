import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createAgent } from "./base";
import { prisma } from "@/src/lib/prisma";

const IT_OPS_SYSTEM_PROMPT = `You are **NexusOps** — Principal SRE for NEXUS (Next.js + Postgres + Redis).
Mission: When triggered, call ALL available tools, then produce a complete health report.

Report format (strict Markdown):
## NEXUS Health Report
### Database
### Orders (last 24h)
### Products & Inventory
### Issues Found
| Priority | Issue | Business Impact | Fix |
|----------|-------|-----------------|-----|

End with a one-line executive summary.`;

const getDbStats = tool(
  async () => {
    try {
      const stats = await prisma.$queryRaw<any[]>`
        SELECT datname, numbackends, xact_commit, xact_rollback, blks_read, blks_hit
        FROM pg_stat_database
        WHERE datname = current_database();
      `;
      return JSON.stringify(stats[0] ?? {});
    } catch (e: any) {
      return `DB stats unavailable: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
  {
    name: "getDbStats",
    description: "Fetch PostgreSQL database statistics (connections, commits, rollbacks, cache hits)",
    schema: z.object({}),
  },
);

const getSlowQueries = tool(
  async () => {
    try {
      // pg_stat_statements requires the extension — graceful fallback
      const rows = await prisma.$queryRaw<any[]>`
        SELECT query, calls, total_exec_time, mean_exec_time
        FROM pg_stat_statements
        ORDER BY mean_exec_time DESC
        LIMIT 5;
      `;
      return JSON.stringify(rows);
    } catch {
      return "pg_stat_statements extension not enabled — install with: CREATE EXTENSION pg_stat_statements;";
    }
  },
  {
    name: "getSlowQueries",
    description: "List the 5 slowest database queries using pg_stat_statements",
    schema: z.object({}),
  },
);

const getOrderStats = tool(
  async () => {
    try {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const [total, recent, cancelled] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { date: { gte: yesterday } } }),
        prisma.order.count({ where: { cancelled: true, date: { gte: yesterday } } }),
      ]);
      const revenue = await prisma.order.aggregate({
        where: { date: { gte: yesterday }, cancelled: false },
        _sum: { total: true },
      });
      return JSON.stringify({
        totalOrders: total,
        last24hOrders: recent,
        last24hCancelled: cancelled,
        last24hRevenue: revenue._sum.total ?? 0,
      });
    } catch (e: any) {
      return `Order stats unavailable: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
  {
    name: "getOrderStats",
    description: "Get order counts and revenue for the last 24 hours",
    schema: z.object({}),
  },
);

const getInventoryAlerts = tool(
  async () => {
    try {
      const lowStock = await prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { name: true, stock: true, category: true },
        orderBy: { stock: "asc" },
        take: 10,
      });
      const outOfStock = await prisma.product.count({ where: { stock: 0 } });
      return JSON.stringify({ outOfStock, lowStock });
    } catch (e: any) {
      return `Inventory data unavailable: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
  {
    name: "getInventoryAlerts",
    description: "Find out-of-stock and low-stock products",
    schema: z.object({}),
  },
);

export const ITOPS_AGENT = createAgent({
  name: "it-operations-reporter",
  description: "Full technical health & operations report",
  systemPrompt: IT_OPS_SYSTEM_PROMPT,
  tools: [getDbStats, getSlowQueries, getOrderStats, getInventoryAlerts],
  temperature: 0.2,
  maxSteps: 15,
});
