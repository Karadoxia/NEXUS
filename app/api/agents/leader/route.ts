import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { prisma } from '@/src/lib/prisma';
import { prismaInfra } from '@/src/lib/prisma-infra';


export async function POST(_request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const job = await prismaInfra.agentJob.create({
    data: { agentName: 'leader', triggeredBy: 'admin', status: 'RUNNING' },
  });

  try {
    // Leader agent is legacy — mark as completed with a placeholder result
    await prismaInfra.agentJob.update({
      where: { id: job.id },
      data: { status: 'COMPLETED', result: { text: 'Leader run not configured' }, completedAt: new Date() },
    });
    return NextResponse.json({ success: true, jobId: job.id });
  } catch (e: unknown) {
    console.error('[leader]', e);
    await prismaInfra.agentJob.update({ where: { id: job.id }, data: { status: 'FAILED', error: String(e) } });
    return NextResponse.json({ error: 'Leader run failed' }, { status: 500 });
  }
}
