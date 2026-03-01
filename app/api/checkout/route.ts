import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';

// Instantiate Stripe once at module level — avoid reconstructing on every request
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
  : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  const { items, customer, address, paymentMethodId } = await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'items must be a non-empty array' }, { status: 400 });
  }

  const email = session?.user?.email || customer?.email || '';

  // Fetch product prices from DB — never trust client-supplied price/amount.
  // Without this check a client can send amount:0.01 and pay almost nothing.
  const itemIds: string[] = items.map((i: { id: string }) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: itemIds } },
    select: { id: true, price: true },
  });

  if (dbProducts.length === 0) {
    return NextResponse.json({ error: 'No valid products found in cart' }, { status: 400 });
  }

  const priceMap = new Map(dbProducts.map((p) => [p.id, p.price]));
  const validItems = items
    .filter((i: { id: string }) => priceMap.has(i.id))
    .map((i: { id: string; quantity: number }) => ({
      id: i.id,
      quantity: Math.max(1, Math.floor(Number(i.quantity) || 1)),
      price: priceMap.get(i.id)!,
    }));

  if (validItems.length === 0) {
    return NextResponse.json({ error: 'No valid products in cart' }, { status: 400 });
  }

  // Server-computed total — client-supplied amount is ignored entirely
  const amount = validItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Associate order with the authenticated user
  let userConnect: { connect: { id: string } } | undefined;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) userConnect = { connect: { id: user.id } };
  }

  try {
    const piParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: { email },
      // automatic_payment_methods surfaces every method enabled in the Stripe dashboard
      automatic_payment_methods: { enabled: true },
    };

    let isPreConfirmed = false;

    if (paymentMethodId) {
      const stored = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId },
        select: { stripeId: true },
      });
      if (stored?.stripeId) {
        // Off-session charge — must use explicit payment_method_types, not automatic
        delete (piParams as Partial<Stripe.PaymentIntentCreateParams>).automatic_payment_methods;
        piParams.payment_method_types = ['card'];
        piParams.payment_method = stored.stripeId;
        piParams.confirm = true;
        piParams.off_session = true;
        isPreConfirmed = true;
      } else {
        console.warn('[checkout] selected payment method has no stripeId, falling back to element');
      }
    }

    // Create the order first so we can stamp its ID into the PaymentIntent metadata.
    // The Stripe webhook (app/api/webhooks/stripe/route.ts) uses metadata.orderId
    // to confirm the order on payment_intent.succeeded — no schema change needed.
    const order = await prisma.order.create({
      data: {
        total: amount,
        status: 'pending',
        shippingAddress: address ?? undefined,
        paymentMethodId: paymentMethodId ?? undefined,
        user: userConnect,
        items: {
          create: validItems.map((i) => ({
            product: { connect: { id: i.id } },
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    piParams.metadata = { ...piParams.metadata, orderId: order.id };

    // Fire order notification to n8n (best-effort — never block the checkout)
    const orderItems = await prisma.cartItem.findMany({
      where: { orderId: order.id },
      include: { product: { select: { name: true } } },
    });
    fetch('http://n8n:5678/webhook/new-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: order.id,
        customer: customer?.name || session?.user?.name || 'Customer',
        email,
        items: orderItems.map(i => ({ name: i.product.name, quantity: i.quantity, price: i.price })),
        total: amount.toFixed(2),
        status: 'pending',
        shippingAddress: address ? `${address.line1 ?? ''}, ${address.city ?? ''}`.trim().replace(/^,\s*/, '') : 'N/A',
        orderUrl: `http://nexus-app.local/account/${order.id}`,
      }),
    }).catch(() => { /* n8n not reachable — ignore */ });

    const paymentIntent = await stripe.paymentIntents.create(piParams);

    // For pre-confirmed (off-session) intents that already succeeded, transition
    // the order immediately — no webhook round-trip needed.
    if (isPreConfirmed && paymentIntent.status === 'succeeded') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'processing' } });
      return NextResponse.json({ orderId: order.id, status: 'succeeded' });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment intent failed';
    console.error('[checkout] stripe error', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
