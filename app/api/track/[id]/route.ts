import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  // try to find by tracking number first, then order id
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ trackingNumber: id }, { id }],
    },
    include: { items: true, shipmentEvents: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(order);
}
