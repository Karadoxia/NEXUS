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
    apiVersion: '2026-01-28.clover' as any,
  });

  const session = await getServerSession(authOptions);
  const { amount, items, customer, address, paymentMethodId } = await request.json();
  if (!amount) {
    return NextResponse.json({ error: 'Amount required' }, { status: 400 });
  }

  const email = session?.user?.email || customer?.email || '';

  try {
    const piParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: { email },
      // card + paypal — Stripe dashboard controls which are live on your account
      payment_method_types: ['card', 'paypal'],
    };

    let isPreConfirmed = false;

    if (paymentMethodId) {
      const stored = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId },
        select: { stripeId: true },
      });
      if (stored?.stripeId) {
        piParams.payment_method = stored.stripeId;
        piParams.confirm = true;
        piParams.off_session = true;
        isPreConfirmed = true;
      } else {
        // Mock/demo saved method — fall back to normal unconfirmed intent
        console.warn('[checkout] selected payment method has no stripeId, falling back to element');
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(piParams);

    // Associate order with the authenticated user (GDPR — guest checkouts are not silently persisted)
    let userConnect: any;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) userConnect = { connect: { id: user.id } };
    }

    const order = await prisma.order.create({
      data: {
        total: amount,
        status: isPreConfirmed && paymentIntent.status === 'succeeded' ? 'processing' : 'pending',
        shippingAddress: address ?? undefined,
        paymentMethodId: paymentMethodId ?? undefined,
        user: userConnect,
        items: {
          create: (items ?? []).map((i: any) => ({
            product: { connect: { id: i.id } },
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    // For pre-confirmed succeeded intents we don't need to return a clientSecret —
    // the frontend redirects to success directly when it gets back orderId.
    if (isPreConfirmed && paymentIntent.status === 'succeeded') {
      return NextResponse.json({ orderId: order.id, status: 'succeeded' });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (err: any) {
    console.error('[checkout] stripe error', err);
    return NextResponse.json(
      { error: err.message || 'Payment intent failed' },
      { status: 500 },
    );
  }
}
