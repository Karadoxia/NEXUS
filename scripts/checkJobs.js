#!/usr/bin/env node
import { prisma } from '../src/lib/prisma.ts';
async function main(){
  const jobs = await prisma.agentJob.findMany({ orderBy: { triggeredAt: 'desc' }, take: 5 });
  console.log('jobs', jobs);
  await prisma.$disconnect();
}
main().catch(console.error);
