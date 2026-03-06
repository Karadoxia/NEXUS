import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const clients = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            addresses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (e: unknown) {
    console.error('[admin clients GET]', e);
    return NextResponse.json({ error: 'Failed to load clients' }, { status: 500 });
  }
}
