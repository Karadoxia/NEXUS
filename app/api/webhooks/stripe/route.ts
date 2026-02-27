/**
 * Stripe Webhook Handler
 *
 * Listens for Stripe events and transitions order status accordingly.
 * This is the authoritative source of truth for payment success/failure —
 * do NOT trust client-side redirects alone.
 *
 * Setup:
 *   1. Add STRIPE_WEBHOOK_SECRET to your .env  (from `stripe listen --print-secret`
 *      in dev, or from the Stripe dashboard in production)
 *   2. In production, register this URL in the Stripe dashboard:
 *      https://dashboard.stripe.com/webhooks → Add endpoint
 *      URL: https://your-domain/api/webhooks/stripe
 *      Events: payment_intent.succeeded, payment_intent.payment_failed
 */

import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any })
  : null;

// Next.js App Router: disable body parsing so we can verify the raw Stripe signature
export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Must use the raw body (text) — a parsed JSON body will fail signature verification
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('[webhook/stripe] signature verification failed:', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.orderId;

      if (!orderId) {
        // Legacy intent without orderId in metadata — nothing to update
        console.warn('[webhook/stripe] payment_intent.succeeded has no orderId in metadata', pi.id);
        break;
      }

      try {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'processing' },
          include: { items: { include: { product: true } }, user: true },
        });

        // Send order confirmation email if we have a user email
        const userEmail = order.user?.email ?? pi.metadata?.email;
        if (userEmail) {
          sendOrderConfirmationEmail({
            orderId: order.id,
            email: userEmail,
            name: order.user?.name ?? 'Customer',
            items: order.items.map((item) => ({
              ...item.product,
              images: Array.isArray(item.product.images) ? (item.product.images as string[]) : [],
              specs: (item.product.specs ?? {}) as Record<string, string>,
              tags: Array.isArray(item.product.tags) ? (item.product.tags as string[]) : [],
              quantity: item.quantity,
            })),
            total: order.total,
            address: order.shippingAddress as any,
          }).catch((e) => console.error('[webhook/stripe] confirmation email failed:', e));
        }
      } catch (e) {
        console.error('[webhook/stripe] failed to update order on succeeded:', e);
        // Return 200 so Stripe does not retry — the event was received, the DB error is ours to fix
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.orderId;

      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'cancelled', cancelled: true },
          });
        } catch (e) {
          console.error('[webhook/stripe] failed to cancel order on payment_failed:', e);
        }
      }
      break;
    }

    default:
      // Unhandled event type — acknowledge receipt so Stripe stops sending it
      break;
  }

  return NextResponse.json({ received: true });
}
