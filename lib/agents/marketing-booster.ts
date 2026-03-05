import { createAgent } from "./base";
import { rustTool } from "./tools";

const PROMPT = `Assess current campaigns, allocate budgets across channels, and propose ideas to boost conversions with a focus on ROI.`;

export const MARKETING_BOOSTER = createAgent({
  name: "marketing-booster",
  description: "Optimize marketing budgets and campaigns",
  systemPrompt: PROMPT,
  tools: [rustTool()],
  temperature: 0.3,
  maxSteps: 10,
});
