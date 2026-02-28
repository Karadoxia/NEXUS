import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { CRMAgent } from '../../../../agents/crmAgent';
import { prisma } from '@/src/lib/prisma';

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const job = await prisma.agentJob.create({ data: { agentName: 'crm', triggeredBy: 'admin', status: 'RUNNING' } });

  try {
    const ctx = {
      workspace: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3030',
      config: {},
    };
    const agent = new CRMAgent(ctx as any);
    const result = await agent.run();
    await prisma.agentJob.update({ where: { id: job.id }, data: { status: 'COMPLETED', completedAt: new Date() } });
    await prisma.agentResult.create({ data: { job: { connect: { id: job.id } }, output: result } });
    return NextResponse.json({ success: true, result, jobId: job.id });
  } catch (e: unknown) {
    await prisma.agentJob.update({ where: { id: job.id }, data: { status: 'FAILED' } });
    await prisma.agentResult.create({ data: { job: { connect: { id: job.id } }, output: {}, error: String(e) } });
    return NextResponse.json({ error: 'CRM Agent run failed' }, { status: 500 });
  }
}
