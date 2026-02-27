import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import fs from 'fs';
import path from 'path';

function loadConfig() {
  const cfgPath = path.resolve(process.cwd(), 'agents/config.json');
  try {
    return JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const config = loadConfig();
  const enabled = (config.agentList ?? []).filter((a: any) => a.enabled);
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (req.headers.get('origin') || 'http://localhost:3030');

  const results: any[] = [];
  for (const a of enabled) {
    const slug = a.name.replace(/\s+/g, '-').toLowerCase();
    const url = `${base}/api/agents/${slug}/trigger`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { cookie: req.headers.get('cookie') ?? '' },
      });
      const data = await res.json();
      results.push({ agent: a.name, data });
    } catch (e) {
      results.push({ agent: a.name, error: String(e) });
    }
  }

  return NextResponse.json({ results });
}
