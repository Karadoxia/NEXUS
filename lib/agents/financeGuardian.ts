import { createAgent } from "./base";

const FINANCE_PROMPT = `You are Nexus Finance Guardian. Monitor cash flow, margins and revenue. Analyze sales data, forecast next quarter income, and suggest cost-cutting or pricing strategies. Provide actionable bullet points with expected impact and urgency.`;

export const FINANCE_AGENT = createAgent({
  name: "Finance Guardian",
  description: "Agent overseeing financial health, margins and forecasting",
  systemPrompt: FINANCE_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
