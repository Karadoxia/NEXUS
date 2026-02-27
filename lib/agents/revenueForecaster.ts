import { createAgent } from "./base";

const PROMPT = `You are Nexus Revenue Forecaster. Use sales, subscriptions, and marketing data to predict next quarter revenue. Explain assumptions and provide confidence intervals.`;

export const REVENUE_FORECASTER = createAgent({
  name: "Revenue Forecaster",
  description: "Predict upcoming revenue based on trends",
  systemPrompt: PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 8,
});
