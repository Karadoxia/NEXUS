import { createAgent } from "./base";
import { rustTool } from "../lib/agents/tools";

const PROMPT = `You are Nexus Loyalty Analyst. Use all tools to gather data, then produce a customer health report covering retention, cancellation trends, and recommendations.`;

export const SENTIMENT_LOYALTY_ANALYST = createAgent({
  name: "sentiment-loyalty-analyst",
  description: "Customer sentiment & loyalty analysis",
  systemPrompt: PROMPT,
  tools: [rustTool()],
  temperature: 0.3,
  maxSteps: 10,
});
