import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { auditLog } from '@/lib/audit';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const isAdmin = (session.user as { isAdmin?: boolean }).isAdmin;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { name: true, image: true, slug: true } } } },
      user:  { select: { email: true, name: true } },
    },
  });
  if (!order || (!isAdmin && order.user?.email !== session.user.email)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.order.findUnique({ where: { id }, include: { user: true } });
  if (!existing) {
    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  }
  const isAdmin = (session.user as { isAdmin?: boolean }).isAdmin;
  if (!isAdmin && existing.user?.email !== session.user.email) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { status, trackingNumber, carrier } = body;
  const updateData: Partial<{ status: string; trackingNumber: string; carrier: string }> = {};
  if (status)         updateData.status         = status;
  if (trackingNumber) updateData.trackingNumber = trackingNumber;
  if (carrier)        updateData.carrier        = carrier;

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
    include: { items: true },
  });

  if (isAdmin && status) {
    await auditLog(session.user.email, 'update', 'order', id, `status → ${status}`);
  }

  return NextResponse.json({ success: true, order });
}
