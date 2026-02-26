import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { Leader } from '../../../../agents/leader';

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  // create a database record for this job; we'll update status/result later
  const job = await prisma.agentJob.create({ data: { agent: 'leader' } });

  try {
    const ctx = {
      workspace: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3030',
      config: { slackWebhook: process.env.SLACK_WEBHOOK },
    };
    const leader = new Leader(ctx as any);
    const result = await leader.run();

    await prisma.agentJob.update({ where: { id: job.id }, data: { status: 'succeeded' } });
    await prisma.agentResult.create({
      data: { job: { connect: { id: job.id } }, output: result },
    });

    return NextResponse.json({ success: true, result, jobId: job.id });
  } catch (e: unknown) {
    console.error('[leader]', e);
    await prisma.agentJob.update({ where: { id: job.id }, data: { status: 'failed' } });
    await prisma.agentResult.create({
      data: { job: { connect: { id: job.id } }, output: {}, error: String(e) },
    });
    return NextResponse.json({ error: 'Leader run failed' }, { status: 500 });
  }
}
