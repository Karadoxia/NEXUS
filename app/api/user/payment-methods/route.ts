import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { paymentMethods: { orderBy: { createdAt: 'desc' } } },
  });
  return NextResponse.json(user?.paymentMethods ?? []);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { type = 'card', brand, stripeId, last4, expMonth, expYear, cardholderName, accountEmail } = body;

  if (!brand) return NextResponse.json({ error: 'brand is required' }, { status: 400 });

  if (type === 'card') {
    if (!last4 || !expMonth || !expYear) {
      return NextResponse.json({ error: 'last4, expMonth and expYear are required for cards' }, { status: 400 });
    }
    if (!/^\d{4}$/.test(last4)) {
      return NextResponse.json({ error: 'last4 must be exactly 4 digits' }, { status: 400 });
    }
  }

  const pm = await prisma.paymentMethod.create({
    data: {
      user: { connect: { email: session.user.email } },
      type,
      brand,
      stripeId: stripeId || null,
      last4: type === 'card' ? last4 : null,
      expMonth: type === 'card' ? Number(expMonth) : null,
      expYear: type === 'card' ? Number(expYear) : null,
      cardholderName: type === 'card' ? (cardholderName || null) : null,
      accountEmail: type === 'wallet' ? (accountEmail || null) : null,
    },
  });
  return NextResponse.json(pm);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const pm = await prisma.paymentMethod.findFirst({
    where: { id, user: { email: session.user.email } },
  });
  if (!pm) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.paymentMethod.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
