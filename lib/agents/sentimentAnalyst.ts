import { createAgent } from "./base";

const SENTIMENT_PROMPT = `You are Nexus Loyalty Analyst. Analyze customer sentiment and loyalty from reviews, support tickets, and social media. Output trends, risks, and actionable steps.`;

export const SENTIMENT_AGENT = createAgent({
  name: "Sentiment & Loyalty Analyst",
  description: "Customer sentiment and loyalty analysis agent",
  systemPrompt: SENTIMENT_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
