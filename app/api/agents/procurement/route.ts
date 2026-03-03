import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { ProcurementAgent } from '../../../../agents/procurementAgent';
import { prisma } from '@/src/lib/prisma';
import { prismaInfra } from '@/src/lib/prisma-infra';


export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const job = await prismaInfra.agentJob.create({ data: { agentName: 'procurement', triggeredBy: 'admin', status: 'RUNNING' } });

  try {
    const ctx = {
      workspace: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3030',
      config: {},
    };
    const agent = new ProcurementAgent(ctx as any);
    const result = await agent.run();
    await prismaInfra.agentJob.update({ where: { id: job.id }, data: { status: 'COMPLETED', completedAt: new Date() } });
    await prismaInfra.agentResult.create({ data: { job: { connect: { id: job.id } }, output: result } });
    return NextResponse.json({ success: true, result, jobId: job.id });
  } catch (e: unknown) {
    await prismaInfra.agentJob.update({ where: { id: job.id }, data: { status: 'FAILED' } });
    await prismaInfra.agentResult.create({ data: { job: { connect: { id: job.id } }, output: {}, error: String(e) } });
    return NextResponse.json({ error: 'Procurement Agent run failed' }, { status: 500 });
  }
}
