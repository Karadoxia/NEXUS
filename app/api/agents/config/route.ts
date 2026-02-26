import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.resolve(process.cwd(), 'agents/config.json');

// Only these keys may be written via the API to prevent arbitrary config injection
const ALLOWED_CONFIG_KEYS = new Set([
  'syncInterval',
  'maxProducts',
  'slackWebhook',
  'enableAutoSync',
  'enableLeader',
  'leadInterval',
  'defaultVendor',
  'agentPrompts', // map of agentName: prompt
  'agentList',    // array of agent definitions
]);

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const json = JSON.parse(data);
    return NextResponse.json(json);
  } catch (e: unknown) {
    console.error('failed to read config', e);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();

    // Strip any keys not in the whitelist
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_CONFIG_KEYS.has(key)) {
        sanitized[key] = body[key];
      }
    }

    // Atomic write via temp file
    const tmp = CONFIG_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(sanitized, null, 2));
    fs.renameSync(tmp, CONFIG_PATH);

    return NextResponse.json(sanitized);
  } catch (e: unknown) {
    console.error('failed to write config', e);
    return NextResponse.json({ error: 'Failed to write config' }, { status: 500 });
  }
}
