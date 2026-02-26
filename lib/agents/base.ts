// minimal stubs for langgraph (avoid installing external packages)

class StateGraph {
  constructor(opts?: any) {}
  addNode(name: string, fn: any) { return this; }
  addEdge(a: any, b: any) { return this; }
  addConditionalEdges(name: string, fn: any) { return this; }
  compile() { return { invoke: async () => ({ messages: [] }) }; }
}
const START = Symbol('start');
const END = Symbol('end');

// import { ChatGroq } from "@langchain/groq"; // or your OpenClaw wrapper
// placeholder ChatGroq implementation if package missing
class ChatGroq {
  constructor(opts: any) {}
  async invoke(messages: any) { return { text: 'no-op' }; }
}
// simple stub for ToolNode
class ToolNode {
  constructor(tools: any[]) {}
}

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
    model: "grok-beta", // or your OpenClaw local model endpoint
    temperature: config.temperature ?? 0.3,
    apiKey: process.env.GROK_API_KEY!,
  });

  const toolNode = new ToolNode(config.tools);

  const agent = new StateGraph({
    channels: {
      messages: { reducer: (x, y) => x.concat(y) },
      next: null,
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
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage.tool_calls?.length > 0) return "tools";
      return END;
    })
    .addEdge("tools", "agent");

  return agent.compile();
}
