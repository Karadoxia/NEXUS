import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });
  if (!order || order.user?.email !== session.user.email) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { status, trackingNumber, carrier } = body;
  const updateData: any = {};
  if (status) updateData.status = status;
  if (trackingNumber) updateData.trackingNumber = trackingNumber;
  if (carrier) updateData.carrier = carrier;

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
    include: { items: true },
  });
  return NextResponse.json({ success: true, order });
}
