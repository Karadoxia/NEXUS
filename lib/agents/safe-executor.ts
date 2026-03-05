import { buildGraph } from "./base"; // buildGraph compiles/returns a runnable graph

// A very simple human-approval stub. Replace with UI-driven modal later.
export async function requireApproval(input: string, userId: string): Promise<boolean> {
  // TODO: implement a real approval workflow (email, websocket notification, etc.)
  console.log("approval requested for user", userId, "input", input.substring(0, 200));
  return true;
}

export interface SafeAgentOptions {
  name: string;
  description?: string;
  systemPrompt: string;
  tools?: any[];
  temperature?: number;
  maxSteps?: number;
  messages: Array<{ role: string; content: string }>; // user+supply messages
  userId?: string;
}

export async function safeAgentRun(opts: SafeAgentOptions) {
  const { messages, userId } = opts;

  // 1. prevent dangerous write/update/delete commands without human signoff
  if (messages.some((m) => /\b(write|update|delete|remove)\b/i.test(m.content))) {
    const approved = await requireApproval(messages.map((m) => m.content).join("\n"), userId ?? "unknown");
    if (!approved) throw new Error("Action rejected by human");
  }

  // 2. sanitize inputs
  const sanitized = messages.map((m) => ({
    ...m,
    content: m.content.replace(/<script|javascript:/gi, ""),
  }));

  // 3. compile graph and run with timeout
  const compiled = await buildGraph(opts as any);
  const result = await Promise.race([
    compiled.invoke({ messages: sanitized }),
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error("Timeout")), 30_000)),
  ]);

  return result;
}
