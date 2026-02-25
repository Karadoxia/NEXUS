import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });

  const session = await getServerSession(authOptions);
  const { amount, items, customer, address } = await request.json();
  if (!amount) {
    return NextResponse.json({ error: 'Amount required' }, { status: 400 });
  }

  // determine email from session or provided customer info
  const email = session?.user?.email || customer?.email || '';

  try {
    // create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: { email },
    });

    // associate or create a user record if email exists
    let userConnect;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) userConnect = { connect: { id: user.id } };
    } else if (email) {
      const guest = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, name: customer?.name || 'Guest' },
      });
      userConnect = { connect: { id: guest.id } };
    }

    const order = await prisma.order.create({
      data: {
        total: amount,
        status: 'pending',
        shippingAddress: address ? address : undefined,
        user: userConnect,
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
