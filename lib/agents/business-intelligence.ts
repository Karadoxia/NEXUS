import { createAgent } from "./base";
import { rustTool } from "./tools";

const PROMPT = `Aggregate data from sales, inventory, marketing, and finance; produce an executive summary of trends and opportunity areas.`;

export const BUSINESS_INTELLIGENCE = createAgent({
  name: "business-intelligence",
  description: "Cross-domain executive analytics and reporting",
  systemPrompt: PROMPT,
  tools: [rustTool()],
  temperature: 0.3,
  maxSteps: 10,
});
