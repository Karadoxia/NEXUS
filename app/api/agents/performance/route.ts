import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request) {
  // return all performance entries, newest first
  const data = await prisma.performance.findMany({ orderBy: { timestamp: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { orders, returns, downtime, notes } = body;
  const entry = await prisma.performance.create({
    data: { orders, returns, downtime, notes },
  });
  return NextResponse.json(entry);
}
