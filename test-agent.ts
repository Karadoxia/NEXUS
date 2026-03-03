import { buildGraph } from './lib/agents/base';

async function testAgent() {
    console.log("Starting test graph build...");
    try {
        const compiled = await buildGraph({
            name: "support-bot-test",
            description: "Test agent",
            systemPrompt: "Say hello",
            tools: [],
            temperature: 0.7
        });

        console.log("Graph built, invoking...");
        const result = await compiled.invoke({ messages: [{ role: 'user', content: 'hello' }] });
        console.dir(result, { depth: null });
    } catch (e) {
        console.error("Test execution failed:", e);
    }
}

testAgent();
