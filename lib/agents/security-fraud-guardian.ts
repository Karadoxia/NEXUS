import { createAgent } from "./base";
import { rustTool } from "./tools";

const PROMPT = `You are Nexus Shield. Audit the system for security risks, suspicious patterns, and fraud indicators. Output actionable steps with effort and impact.`;

export const SECURITY_FRAUD_GUARDIAN = createAgent({
  name: "security-fraud-guardian",
  description: "Security & fraud audit",
  systemPrompt: PROMPT,
  tools: [rustTool()],
  temperature: 0.3,
  maxSteps: 10,
});
