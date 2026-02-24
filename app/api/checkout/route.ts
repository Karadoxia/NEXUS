import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-01-28.clover',
  });

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { amount, items } = await request.json();
  if (!amount) {
    return NextResponse.json({ error: 'Amount required' }, { status: 400 });
  }

  try {
    // create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: { email: session.user.email },
    });

    // create order record pending
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const order = await prisma.order.create({
      data: {
        total: amount,
        status: 'pending',
        user: user ? { connect: { id: user.id } } : undefined,
        items: {
          create: items.map((i: any) => ({
            product: { connect: { id: i.id } },
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (err: any) {
    console.error('stripe error', err);
    return NextResponse.json({ error: err.message || 'Payment intent failed' }, { status: 500 });
  }
}
