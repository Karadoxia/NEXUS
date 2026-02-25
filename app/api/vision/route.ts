import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { imageUrl } = await request.json();
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: 'no key' }, { status: 400 });
  try {
    const resp = await fetch('https://api.googleapis.com/v1/models/gemini-1.5-realtime:predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        input: { text: `Describe the contents of this image: ${imageUrl}` },
      }),
    });
    const data = await resp.json();
    return NextResponse.json({ analysis: data.outputText });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
