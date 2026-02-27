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

// Groq API key — support both common spellings
function getGroqKey() {
  const key = process.env.GROQ_API_KEY ?? process.env.GROK_API_KEY ?? "";
  if (!key) console.warn("[agents] GROQ_API_KEY is not set — LLM calls will fail");
  return key;
}

// Build and compile the LangChain graph (no DB interaction).
// Uses llama-3.3-70b-versatile — a valid free Groq model.
// The old code used "grok-beta" (xAI) which is NOT available via Groq API.
export async function buildGraph(config: AgentConfig) {
  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: config.temperature ?? 0.3,
    apiKey: getGroqKey(),
  });

  const toolNode = new ToolNode(config.tools);

  const graph = new StateGraph({
    channels: {
      messages: { reducer: (x: any[], y: any[]) => x.concat(y) },
    },
  } as any)
    .addNode("agent", async (state: any) => {
      const response = await model.invoke([
        { role: "system", content: config.systemPrompt },
        ...state.messages,
      ]);
      return { messages: [response] };
    })
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", (state: any) => {
      const last = state.messages[state.messages.length - 1];
      return last.tool_calls?.length ? "tools" : END;
    })
    .addEdge("tools", "agent");

  return graph.compile();
}

// Run an agent with full job lifecycle.
// Creates a DB job, runs the graph, updates on success/failure.
// Pass existingJobId to reuse an already-created job record.
export async function runAgentJob(
  config: AgentConfig,
  input: string,
  triggeredBy = "admin",
  existingJobId?: string,
) {
  const jobId = existingJobId
    ? existingJobId
    : (
        await prisma.agentJob.create({
          data: { agentName: config.name, triggeredBy, status: "RUNNING" },
        })
      ).id;

  const start = Date.now();
  try {
    const compiled = await buildGraph(config);
    const result = await compiled.invoke({
      messages: [{ role: "user", content: input }],
    });
    const text = result?.messages?.at(-1)?.content ?? JSON.stringify(result);
    await prisma.agentJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        result: { text },
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    });
    return { jobId, result: text };
  } catch (err: any) {
    await prisma.agentJob.update({
      where: { id: jobId },
      data: { status: "FAILED", error: err.message },
    });
    throw err;
  }
}

// createAgent — synchronous so module-level exports resolve to the object directly.
// (async would make them Promise<{invoke}> which breaks agent.invoke() at call sites)
export function createAgent(config: AgentConfig) {
  return {
    invoke: async (input: { messages: any[] }) => {
      const userMessage =
        input.messages?.find((m: any) => m.role === "user")?.content ?? "Run now";
      return runAgentJob(config, userMessage);
    },
  };
}
