import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';

// returns recent jobs with result information
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const jobs = await prisma.agentJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { result: true },
  });
  return NextResponse.json(jobs);
}
