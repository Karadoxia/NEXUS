import { createAgent } from "./base";

const PROMPT = `You are Nexus Support Bot. Help customers with order issues, returns and product questions in a polite conversational tone.`;

export const SUPPORT_BOT = createAgent({
  name: "Support Bot",
  description: "Customer support conversational agent",
  systemPrompt: PROMPT,
  tools: [],
  temperature: 0.5,
  maxSteps: 12,
});
