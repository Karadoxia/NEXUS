import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { runNewsletterAgent } from '@/lib/agents/newsletterAgent';

// POST /api/agents/newsletter-agent/trigger
// Wires the dashboard "Run newsletter-agent" button to the actual send pipeline
// (fetch AI news → LLM intro → bulk Resend to all subscribers).
export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const result = await runNewsletterAgent('admin');
    return NextResponse.json({
      jobId: result.jobId,
      sent: result.sent,
      status: 'started',
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
