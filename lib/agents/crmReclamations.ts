import { createAgent } from "./base";

const CRM_PROMPT = `You are Nexus CRM Reclamations. Handle customer complaints, returns and refunds. Analyze order history, propose resolutions, and identify systemic issues. Output templated responses and operational suggestions.`;

export const CRM_AGENT = createAgent({
  name: "CRM Reclamations",
  description: "Agent managing customer service issues and refund requests",
  systemPrompt: CRM_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
