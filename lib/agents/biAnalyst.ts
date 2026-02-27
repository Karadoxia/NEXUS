import { createAgent } from "./base";

const BI_PROMPT = `You are Nexus Business Intelligence Analyst. Pull data across sales, inventory, marketing, and finance to produce executive reports. Highlight trends, anomalies, and opportunities in clear language with charts/data suggestions.`;

export const BI_AGENT = createAgent({
  name: "Business Intelligence",
  description: "Agent for cross-domain executive reporting and insights",
  systemPrompt: BI_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
