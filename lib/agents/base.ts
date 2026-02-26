import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { prisma } from "@/src/lib/prisma";

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  tools: any[];
  temperature?: number;
  maxSteps?: number;
}

export async function createAgent(config: AgentConfig) {
  const model = new ChatGroq({
    model: "grok-beta",
    temperature: config.temperature ?? 0.3,
    apiKey: process.env.GROK_API_KEY!,
  });

  const toolNode = new ToolNode(config.tools);

  const graph = new StateGraph({
    channels: {
      messages: { reducer: (x: any[], y: any[]) => x.concat(y) },
    },
  })
    .addNode("agent", async (state) => {
      const response = await model.invoke([
        { role: "system", content: config.systemPrompt },
        ...state.messages,
      ]);
      return { messages: [response] };
    })
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", (state) => {
      const last = state.messages[state.messages.length - 1];
      return last.tool_calls?.length ? "tools" : END;
    })
    .addEdge("tools", "agent");

  const compiled = graph.compile();

  // return a helper that logs job info
  return async (input: string, triggeredBy = "admin") => {
    const job = await prisma.agentJob.create({
      data: { agentName: config.name, triggeredBy, status: "RUNNING" },
    });

    const start = Date.now();
    try {
      const result = await compiled.invoke({ messages: [{ role: "user", content: input }] });
      await prisma.agentJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          result: result,
          completedAt: new Date(),
          durationMs: Date.now() - start,
        },
      });
      return result;
    } catch (err: any) {
      await prisma.agentJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: err.message },
      });
      throw err;
    }
  };
}
