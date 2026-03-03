import { NextResponse } from 'next/server';

const N8N_BASE = process.env.N8N_API_BASE ?? 'http://n8n:5678/api/v1';
const N8N_KEY  = process.env.N8N_API_KEY  ?? '';

export async function GET() {
  if (!N8N_KEY) {
    return NextResponse.json({ error: 'N8N_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Fetch up to 100 workflows
    const res = await fetch(`${N8N_BASE}/workflows?limit=100`, {
      headers: { 'X-N8N-API-KEY': N8N_KEY },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json.data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
