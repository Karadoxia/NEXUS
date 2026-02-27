import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
// LangSmithTracer may not be available in all langchain versions; we'll
// dynamically import when needed rather than relying on a static import.
import { prisma } from "@/src/lib/prisma";

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  tools: unknown[];
  temperature?: number;
  maxSteps?: number;
}

// Default agent timeout: 120 seconds.  Prevents hung LLM calls from leaving
// AgentJob records stuck in RUNNING state indefinitely.
const AGENT_TIMEOUT_MS = 120_000;

// Groq API key — support both common spellings
function getGroqKey() {
  const key = process.env.GROQ_API_KEY ?? process.env.GROK_API_KEY ?? "";
  if (!key) console.warn("[agents] GROQ_API_KEY is not set — LLM calls will fail");
  return key;
}

// Compiled graph cache keyed by a hash of (name + systemPrompt + temperature).
// The LangGraph compile step is not free; caching avoids repeating it on every
// trigger for agents that always use the same config (all specialized agents).
// Dynamic agents (different prompt each run) will produce unique cache keys and
// therefore won't hit stale entries.
const graphCache = new Map<string, ReturnType<typeof buildGraphUncached> extends Promise<infer R> ? R : never>();

async function buildGraphUncached(config: AgentConfig) {
  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: config.temperature ?? 0.3,
    apiKey: getGroqKey(),
  });

  // Attach LangSmith tracer if key is provided and module is available
  if (process.env.LANGSMITH_API_KEY) {
    try {
      const mod = await import("@langchain/tracing");
      const LangSmithTracer = (mod as Record<string, unknown>)?.LangSmithTracer as new (opts: { apiKey: string }) => unknown;
      if (LangSmithTracer) {
        const tracer = new LangSmithTracer({ apiKey: process.env.LANGSMITH_API_KEY });
        const m = model as Record<string, unknown>;
        if (typeof m.addTracer === "function") {
          (m.addTracer as (t: unknown) => void)(tracer);
        } else if (typeof m.configure === "function") {
          (m.configure as (opts: { tracer: unknown }) => void)({ tracer });
        }
      }
    } catch (e) {
      console.warn("LangSmith tracer not available", e);
    }
  }

  const toolNode = new ToolNode(config.tools || []);

  const graph = new StateGraph({
    channels: {
      messages: { reducer: (x: unknown[], y: unknown[]) => x.concat(y) },
    },
  } as never)
    .addNode("agent", async (state: { messages: unknown[] }) => {
      const response = await model.invoke([
        { role: "system", content: config.systemPrompt },
        ...state.messages,
      ]);
      return { messages: [response] };
    })
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", (state: { messages: Array<{ tool_calls?: unknown[] }> }) => {
      const last = state.messages[state.messages.length - 1];
      return last.tool_calls?.length ? "tools" : END;
    })
    .addEdge("tools", "agent");

  return graph.compile();
}

// Build and compile the LangChain graph, using a module-level cache so repeated
// triggers of the same agent don't recompile the graph from scratch.
export async function buildGraph(config: AgentConfig) {
  const cacheKey = `${config.name}::${config.temperature ?? 0.3}::${config.systemPrompt}`;
  const cached = graphCache.get(cacheKey);
  if (cached) return cached;

  const compiled = await buildGraphUncached(config);
  graphCache.set(cacheKey, compiled as never);
  return compiled;
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

    // Race the graph invocation against a hard timeout so a hanging LLM call
    // does not leave the job record in RUNNING state indefinitely.
    const timeoutMs = (config.maxSteps ?? 15) * 15_000;
    const effectiveTimeout = Math.min(timeoutMs, AGENT_TIMEOUT_MS);

    const result = await Promise.race([
      compiled.invoke({ messages: [{ role: "user", content: input }] }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Agent timed out after ${effectiveTimeout / 1000}s`)),
          effectiveTimeout,
        ),
      ),
    ]);

    const lastContent = (result as { messages: Array<{ content?: unknown }> })?.messages?.at(-1)?.content;
    const text = typeof lastContent === "string" ? lastContent : JSON.stringify(result);

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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    await prisma.agentJob.update({
      where: { id: jobId },
      data: { status: "FAILED", error: msg },
    });
    throw err;
  }
}

// createAgent — synchronous so module-level exports resolve to the object directly.
// (async would make them Promise<{invoke}> which breaks agent.invoke() at call sites)
export function createAgent(config: AgentConfig) {
  return {
    invoke: async (input: { messages: Array<{ role: string; content: string }> }) => {
      const userMessage =
        input.messages?.find((m) => m.role === "user")?.content ?? "Run now";
      return runAgentJob(config, userMessage);
    },
  };
}
