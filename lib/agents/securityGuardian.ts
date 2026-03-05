import { createAgent } from "./base";

const SECURITY_PROMPT = `You are Nexus Shield. Audit security, fraud, and compliance risks. Recommend fixes and report vulnerabilities. Output actionable steps, impact, and effort.`;

export const SECURITY_AGENT = createAgent({
  name: "Security & Fraud Guardian",
  description: "Security and fraud detection agent",
  systemPrompt: SECURITY_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
