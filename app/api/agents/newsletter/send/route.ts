import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { runNewsletterAgent } from '@/lib/agents/newsletterAgent';

// POST /api/agents/newsletter/send — trigger newsletter generation + bulk send
export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const result = await runNewsletterAgent('admin');
    return NextResponse.json({ jobId: result.jobId, sent: result.sent, failed: (result as any).failed ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
