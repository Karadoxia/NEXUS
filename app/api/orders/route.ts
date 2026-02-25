import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  const email = searchParams.get('email');
  if (email) {
    const orders = await prisma.order.findMany({
      where: { user: { email } },
      include: { items: true },
    });
    return NextResponse.json(orders);
  }

  const orders = await prisma.order.findMany({
    where: { user: { email: session.user.email } },
    include: { items: true },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  // expect items array and total, optionally shippingAddress
  const { items, total, shippingAddress } = body;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const order = await prisma.order.create({
    data: {
      total,
      status: 'pending',
      shippingAddress: shippingAddress || undefined,
      user: user ? { connect: { id: user.id } } : undefined,
      items: {
        create: items.map((i: any) => ({
          product: { connect: { id: i.id } },
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ success: true, order });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, status, trackingNumber, carrier, cancelled } = body;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const updateData: any = {};
  if (status) updateData.status = status;
  if (trackingNumber) updateData.trackingNumber = trackingNumber;
  if (carrier) updateData.carrier = carrier;
  if (typeof cancelled === 'boolean') updateData.cancelled = cancelled;

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
    include: { items: true },
  });

  return NextResponse.json({ success: true, order });
}
