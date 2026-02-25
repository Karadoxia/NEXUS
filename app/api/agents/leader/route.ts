import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { Leader } from '@/../../agents/leader';

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const ctx = {
      workspace: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3030',
      config: { slackWebhook: process.env.SLACK_WEBHOOK },
    };
    const leader = new Leader(ctx as any);
    const result = await leader.run();
    return NextResponse.json({ success: true, result });
  } catch (e: unknown) {
    console.error('[leader]', e);
    return NextResponse.json({ error: 'Leader run failed' }, { status: 500 });
  }
}
