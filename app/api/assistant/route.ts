import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();
  // call Gemini Realtime (Google) if key available
  const API_KEY = process.env.GEMINI_API_KEY;
  if (API_KEY) {
    try {
      const resp = await fetch('https://api.googleapis.com/v1/models/gemini-1.5-realtime:predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          input: { text },
        }),
      });
      const data = await resp.json();
      const reply = data?.outputText || 'Sorry, no response';
      return NextResponse.json({ reply });
    } catch (e) {
      console.error('gemini error', e);
    }
  }
  // fallback
  return NextResponse.json({ reply: `You said \"${text}\"` });
}
