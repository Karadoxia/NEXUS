import { createAgent } from "./base";
import { prisma } from "@/src/lib/prisma";
import * as Sentry from "@sentry/nextjs";

const IT_OPS_SYSTEM_PROMPT = `You are **NexusOps** — Principal SRE & DevOps Engineer for premium Next.js e-commerce platforms.
Context: NEXUS runs on Next.js 15 + Postgres 16 + Redis + Vercel/Railway. Must maintain 99.99% uptime and <400ms checkout.
Mission: Deliver a complete technical health report when triggered.

Tools you MUST use:
- getDbStats()
- getSlowQueries()
- getRecentSentryErrors()
- getApiLatencyStats()
- getCoreWebVitals()
- getResourceUsage()

Step-by-step:
1. Gather fresh data
2. Classify every issue: P0 (revenue risk), P1, P2, P3
3. For each: Description, €/conversion impact, root cause, fix, effort, one-click safe?

Output STRICT Markdown with emojis and tables. End with "Ready for human approval on any fix?"`;

async function getDbStats() {
  const stats = await prisma.$queryRaw`SELECT * FROM pg_stat_database LIMIT 5;`;
  return { connections: stats, slowQueries: "..." };
}

async function getSlowQueries() {
  return await prisma.$queryRaw`SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;`;
}

async function getRecentSentryErrors() {
  // Sentry SDK call - replace with your project
  return { errors: "No critical errors in last 24h" };
}

const tools = [
  { name: "getDbStats", description: "Database stats", func: getDbStats },
  { name: "getSlowQueries", description: "Slow queries", func: getSlowQueries },
  { name: "getRecentSentryErrors", description: "Recent Sentry errors", func: getRecentSentryErrors },
  // add getCoreWebVitals, getApiLatencyStats etc. the same way
];

export const ITOPS_AGENT = createAgent({
  name: "IT-Operations-Reporter",
  description: "Full technical health & operations report",
  systemPrompt: IT_OPS_SYSTEM_PROMPT,
  tools,
  temperature: 0.2,
  maxSteps: 15,
});
