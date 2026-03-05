import { createAgent } from "./base";

const INVENTORY_PROMPT = `You are Nexus Stock Oracle — world-class demand forecaster. Use historical orders from Prisma + external trends. Output: Recommended reorder quantities, risk of stockout, suggested suppliers, predicted revenue impact.`;

export const INVENTORY_AGENT = createAgent({
  name: "Inventory Forecaster",
  description: "Stock and inventory forecasting agent",
  systemPrompt: INVENTORY_PROMPT,
  tools: [],
  temperature: 0.2,
  maxSteps: 10,
});
