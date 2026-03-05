import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { promises as fsp } from 'fs';
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
    // Use async readFile to avoid blocking the Node.js event loop
    const data = await fsp.readFile(CONFIG_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
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

    // Read the existing config first so the PUT is a merge, not an overwrite.
    // Without this, sending { maxProducts: 100 } would delete all other keys.
    let existing: Record<string, unknown> = {};
    try {
      existing = JSON.parse(await fsp.readFile(CONFIG_PATH, 'utf-8'));
    } catch {
      // File may not exist yet on first write — start from an empty base
    }

    // Merge incoming changes over existing values, only for whitelisted keys
    const merged: Record<string, unknown> = { ...existing };
    for (const key of Object.keys(body)) {
      if (ALLOWED_CONFIG_KEYS.has(key)) {
        merged[key] = body[key];
      }
    }

    // Atomic write via temp file + rename to prevent a partial read mid-write
    const tmp = CONFIG_PATH + '.tmp';
    await fsp.writeFile(tmp, JSON.stringify(merged, null, 2), 'utf-8');
    await fsp.rename(tmp, CONFIG_PATH);

    return NextResponse.json(merged);
  } catch (e: unknown) {
    console.error('failed to write config', e);
    return NextResponse.json({ error: 'Failed to write config' }, { status: 500 });
  }
}
