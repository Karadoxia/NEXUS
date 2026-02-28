import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createAgent } from "./base";
import { prisma } from "@/src/lib/prisma";

const SENTIMENT_PROMPT = `You are Nexus Loyalty Analyst.
Use your tools to gather real data, then produce a customer health report.

Report format:
## Customer Sentiment Report
### Overview
### Key Metrics
### Risks
### Recommendations (ranked by impact)`;

const getCustomerMetrics = tool(
  async () => {
    try {
      const [totalUsers, newUsers30d, cancelRate] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        }),
        prisma.order.count({ where: { cancelled: true } }),
      ]);
      const totalOrders = await prisma.order.count();
      return JSON.stringify({
        totalUsers,
        newUsersLast30Days: newUsers30d,
        totalOrders,
        cancelledOrders: cancelRate,
        cancellationRate: totalOrders
          ? ((cancelRate / totalOrders) * 100).toFixed(1) + "%"
          : "0%",
      });
    } catch (e: any) {
      return `Metrics unavailable: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
  {
    name: "getCustomerMetrics",
    description: "Fetch user counts, new signups (30d), and order cancellation rates",
    schema: z.object({}),
  },
);

const getRetentionData = tool(
  async () => {
    try {
      // users who have placed more than one order
      const repeatBuyers = await prisma.user.count({
        where: { orders: { some: {} } },
      });
      const multiOrder = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count FROM (
          SELECT "userId" FROM "Order"
          WHERE "userId" IS NOT NULL AND cancelled = false
          GROUP BY "userId" HAVING COUNT(*) > 1
        ) sub;
      `;
      return JSON.stringify({
        usersWithOrders: repeatBuyers,
        repeatBuyers: Number(multiOrder[0]?.count ?? 0),
      });
    } catch (e: any) {
      return `Retention data unavailable: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
  {
    name: "getRetentionData",
    description: "Get repeat buyer count and retention indicators",
    schema: z.object({}),
  },
);

export const SENTIMENT_AGENT = createAgent({
  name: "sentiment-loyalty-analyst",
  description: "Customer sentiment and loyalty analysis",
  systemPrompt: SENTIMENT_PROMPT,
  tools: [getCustomerMetrics, getRetentionData],
  temperature: 0.3,
  maxSteps: 10,
});
