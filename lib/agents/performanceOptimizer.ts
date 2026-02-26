import { createAgent } from "./base";

const PERF_PROMPT = `You are Nexus Performance Oracle. Analyze site speed, Core Web Vitals, and recommend optimizations for checkout, homepage, and product pages. Output actionable steps, impact, and effort.`;

export const PERF_AGENT = createAgent({
  name: "Performance Optimizer",
  description: "Site speed and performance optimization agent",
  systemPrompt: PERF_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
