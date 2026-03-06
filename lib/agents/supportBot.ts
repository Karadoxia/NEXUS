import { createAgent } from "./base";
import { searchProductsTool } from "./tools";

const PROMPT = `You are Nexus Support Bot. Help customers with order issues, returns and product questions in a polite conversational tone.
Use the searchProducts tool to find information about our products when asked.`;

export const SUPPORT_BOT = createAgent({
  name: "Support Bot",
  description: "Customer support conversational agent",
  systemPrompt: PROMPT,
  tools: [searchProductsTool],
  temperature: 0.5,
  maxSteps: 12,
});
