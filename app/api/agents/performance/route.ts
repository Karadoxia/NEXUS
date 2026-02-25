import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const data = await prisma.performance.findMany({
    orderBy: { timestamp: 'desc' },
    take: 500,
  });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { orders, returns, downtime, notes } = body;

    if (typeof orders !== 'number' || typeof returns !== 'number') {
      return NextResponse.json({ error: 'orders and returns must be numbers' }, { status: 400 });
    }

    const entry = await prisma.performance.create({
      data: { orders, returns, downtime: !!downtime, notes },
    });
    return NextResponse.json(entry);
  } catch (e: unknown) {
    console.error('[performance POST]', e);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
