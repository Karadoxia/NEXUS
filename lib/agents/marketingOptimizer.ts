import { createAgent } from "./base";

const MARKETING_PROMPT = `You are Nexus Marketing Booster. Evaluate current campaigns, recommend budget allocations across channels (social, email, ads), and propose creative ideas to increase conversion. Output metrics-driven plan with projected ROI.`;

export const MARKETING_AGENT = createAgent({
  name: "Marketing Booster",
  description: "Agent that optimizes marketing spend and campaign effectiveness",
  systemPrompt: MARKETING_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
