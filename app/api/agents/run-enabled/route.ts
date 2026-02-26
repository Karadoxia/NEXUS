import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/src/lib/prisma';

function loadConfig() {
  const cfgPath = path.resolve(process.cwd(), 'agents/config.json');
  try {
    const raw = fs.readFileSync(cfgPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function POST() {
  const config = loadConfig();
  const list = config.agentList || [];
  const enabled = list.filter((a: any) => a.enabled);
  const results: any[] = [];

  for (const a of enabled) {
    const endpoint = `/api/agents/${a.name.replace(/\s+/g,'-').toLowerCase()}/trigger`;
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      results.push({ agent: a.name, data });
    } catch (e) {
      results.push({ agent: a.name, error: String(e) });
    }
  }

  return NextResponse.json({ results });
}
