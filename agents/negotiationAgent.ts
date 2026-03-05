import { Agent, AgentContext } from './base';

export class NegotiationAgent extends Agent {
  async run() {
    // simple stub: run a negotiation conversation using Gemini if available
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_KEY) {
      try {
        const prompt = `You are a procurement negotiation assistant. Suggest a 5% discount on bulk orders.`;
        const resp = await fetch('https://api.googleapis.com/v1/models/gemini-1.5-realtime:predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GEMINI_KEY}`,
          },
          body: JSON.stringify({ input: { text: prompt } }),
        });
        const data = await resp.json();
        return { success: true, terms: data.outputText || 'no response' };
      } catch (e) {
        console.error('negotiation gemini error', e);
      }
    }
    // fallback static
    return { success: true, terms: 'Price reduced by 5% on high-volume SKUs' };
  }
}
