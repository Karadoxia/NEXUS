import { createAgent } from "./base";
import { rustTool } from "./tools";

const PROMPT = `The user will provide a list of numbers.  Use the rust-service tool to
compute the sum of the numbers and return the result.`;

export const RUST_SUM = createAgent({
  name: "rust-sum",
  description: "Proxy to Rust service for adding numbers",
  systemPrompt: PROMPT,
  tools: [rustTool()],
  temperature: 0,
  maxSteps: 3,
});
