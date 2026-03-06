import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { SENTIMENT_AGENT } from "@/lib/agents/sentimentAnalyst";
import { prismaInfra } from '@/src/lib/prisma-infra';


const agents = { "sentiment-analyst": SENTIMENT_AGENT };

export async function POST(req: NextRequest) {
  const agent = agents["sentiment-analyst"];
  if (!agent) return Response.json({ error: "Agent not found" }, { status: 404 });

  const job = await prismaInfra.agentJob.create({
    data: { agentName: "sentiment-analyst", triggeredBy: "admin" },
  });

  (async () => {
    const start = Date.now();
    try {
      const result = await agent.invoke({ messages: [{ role: "user", content: "Run sentiment analysis" }] });
      await prismaInfra.agentJob.update({
        where: { id: job.id },
        data: { status: "COMPLETED", result: result, completedAt: new Date(), durationMs: Date.now() - start },
      });
    } catch (e) {
      await prismaInfra.agentJob.update({ where: { id: job.id }, data: { status: "FAILED", error: String(e) } });
    }
  })();

  return Response.json({ jobId: job.id, status: "started", message: "Agent launched in background" });
}
