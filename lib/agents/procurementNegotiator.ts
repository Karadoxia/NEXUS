import { createAgent } from "./base";

const PROCUREMENT_PROMPT = `You are Nexus Procurement Negotiator. Review supplier contracts, forecast demand, and negotiate better pricing or terms. Aim to reduce costs while avoiding stockouts. Provide negotiation talking points and backup data.`;

export const PROCUREMENT_AGENT = createAgent({
  name: "Procurement Negotiator",
  description: "Agent focused on supplier negotiations and inventory cost",
  systemPrompt: PROCUREMENT_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
