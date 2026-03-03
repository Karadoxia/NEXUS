import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';
import { prismaInfra } from '@/src/lib/prisma-infra';


// returns recent jobs with result information
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const jobs = await prismaInfra.agentJob.findMany({
    orderBy: { triggeredAt: 'desc' },
    take: 50,
    include: { results: true },
  });
  return NextResponse.json(jobs);
}
