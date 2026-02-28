import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ orders: [], total: 0 }, { status: 401 });
  }

  // Always scope to the authenticated user — never trust a client-supplied email param
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50', 10));

  const where = { user: { email: session.user.email } };
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { items, shippingAddress, paymentMethodId } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: false, message: 'items must be a non-empty array' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  // Fetch prices from DB — never trust client-supplied price/total
  const itemIds: string[] = items.map((i: { id: string }) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, price: true },
  });

  const priceMap = new Map(dbProducts.map((p) => [p.id, p.price]));
  const validItems = items
    .filter((i: { id: string }) => priceMap.has(i.id))
    .map((i: { id: string; quantity: number }) => ({
      id: i.id,
      quantity: Math.max(1, Math.floor(Number(i.quantity) || 1)),
      price: priceMap.get(i.id)!,
    }));

  if (validItems.length === 0) {
    return NextResponse.json({ success: false, message: 'No valid products in cart' }, { status: 400 });
  }

  // Server-computed total — client-supplied total is ignored
  const serverTotal = validItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  try {
    const order = await prisma.order.create({
      data: {
        total: serverTotal,
        status: 'pending',
        shippingAddress: shippingAddress || undefined,
        paymentMethodId: paymentMethodId || undefined,
        user: user ? { connect: { id: user.id } } : undefined,
        items: {
          create: validItems.map((i) => ({
            product: { connect: { id: i.id } },
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json({ success: true, order });
  } catch (e: unknown) {
    console.error('[orders POST]', e);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status, trackingNumber, carrier, cancelled } = body;
  if (!id) return NextResponse.json({ success: false, message: 'id required' }, { status: 400 });

  const isAdmin = session.user.isAdmin === true;

  // Non-admin users may only cancel their own pending orders
  if (!isAdmin) {
    if (cancelled !== true || status !== undefined || trackingNumber !== undefined || carrier !== undefined) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }
    // Verify the order belongs to this user and is still pending
    const existing = await prisma.order.findFirst({
      where: { id, user: { email: session.user.email }, status: 'pending', cancelled: false },
    });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Order not found or cannot be cancelled' }, { status: 404 });
    }
    try {
      const order = await prisma.order.update({
        where: { id },
        data: { cancelled: true, status: 'cancelled' },
        include: { items: true },
      });
      return NextResponse.json({ success: true, order });
    } catch (e: unknown) {
      console.error('[orders PUT cancel]', e);
      return NextResponse.json({ success: false, message: 'Failed to cancel order' }, { status: 500 });
    }
  }

  // Admin: full update
  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (trackingNumber) updateData.trackingNumber = trackingNumber;
  if (carrier) updateData.carrier = carrier;
  if (typeof cancelled === 'boolean') updateData.cancelled = cancelled;

  try {
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });
    return NextResponse.json({ success: true, order });
  } catch (e: unknown) {
    console.error('[orders PUT]', e);
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 });
  }
}
