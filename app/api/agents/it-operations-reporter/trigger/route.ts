import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { ITOPS_AGENT } from "@/lib/agents/itOperationsReporter";

const agents = { "it-operations-reporter": ITOPS_AGENT };

export async function POST(req: NextRequest) {
  const agent = agents["it-operations-reporter"];
  if (!agent) return Response.json({ error: "Agent not found" }, { status: 404 });

  const job = await prisma.agentJob.create({
    data: { agentName: "it-operations-reporter", triggeredBy: "admin" },
  });

  (async () => {
    const start = Date.now();
    try {
      const result = await agent.invoke({ messages: [{ role: "user", content: "Run full report now" }] });
      await prisma.agentJob.update({
        where: { id: job.id },
        data: { status: "COMPLETED", result: result, completedAt: new Date(), durationMs: Date.now() - start },
      });
    } catch (e) {
      await prisma.agentJob.update({ where: { id: job.id }, data: { status: "FAILED", error: String(e) } });
    }
  })();

  return Response.json({ jobId: job.id, status: "started", message: "Agent launched in background" });
}
