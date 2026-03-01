import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';

// Only initialise when the key is a real Stripe key (sk_test_ or sk_live_)
const sk = process.env.STRIPE_SECRET_KEY ?? '';
const stripe = sk.startsWith('sk_')
  ? new Stripe(sk, { apiVersion: '2025-01-27.acacia' as any })
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

  // Fetch product prices from DB — never trust client-supplied price/amount
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

  // Resolve user for order association
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
      automatic_payment_methods: { enabled: true },
    };

    let isPreConfirmed = false;

    if (paymentMethodId) {
      const stored = await prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId },
        select: { stripeId: true },
      });
      if (stored?.stripeId) {
        delete (piParams as Partial<Stripe.PaymentIntentCreateParams>).automatic_payment_methods;
        piParams.payment_method_types = ['card'];
        piParams.payment_method = stored.stripeId;
        piParams.confirm = true;
        piParams.off_session = true;
        isPreConfirmed = true;
      }
    }

    // ── STEP 1: Create PaymentIntent FIRST ──────────────────────────────────
    // If the Stripe key is wrong this throws immediately — before any order
    // is written to the DB, so no orphaned records are left behind.
    const paymentIntent = await stripe.paymentIntents.create(piParams);

    // ── STEP 2: Create order (only reachable if PI succeeded) ───────────────
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
      include: { items: { include: { product: { select: { name: true } } } } },
    });

    // ── STEP 3: Stamp orderId into PI metadata for the Stripe webhook ───────
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: { email, orderId: order.id },
    });

    // ── STEP 4: Fire n8n order notification (best-effort) ───────────────────
    fetch('http://n8n:5678/webhook/new-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: order.id,
        customer: customer?.name || session?.user?.name || 'Customer',
        email,
        items: order.items.map((i: { product: { name: string }; quantity: number; price: number }) => ({
          name: i.product.name, quantity: i.quantity, price: i.price,
        })),
        total: amount.toFixed(2),
        status: 'pending',
        shippingAddress: address
          ? `${address.line1 ?? ''}, ${address.city ?? ''}`.trim().replace(/^,\s*/, '')
          : 'N/A',
        orderUrl: `http://nexus-app.local/account/${order.id}`,
      }),
    }).catch(() => { /* n8n not reachable — ignore */ });

    // Pre-confirmed off-session charge that already succeeded
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
