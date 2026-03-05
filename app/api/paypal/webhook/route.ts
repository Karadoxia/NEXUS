import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// PayPal webhook — extra reliability layer
// Register in PayPal Dashboard → Webhooks → PAYMENT.CAPTURE.COMPLETED
export async function POST(request: Request) {
  try {
    const event = await request.json();

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const refId = event.resource?.supplementary_data?.related_ids?.order_id
        ?? event.resource?.custom_id
        ?? event.resource?.purchase_units?.[0]?.reference_id;

      if (refId) {
        await prisma.order.updateMany({
          where: { id: refId, status: { not: 'paid' } },
          data: { status: 'paid' },
        });
        console.log('[paypal/webhook] Order paid via webhook:', refId);
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[paypal/webhook]', err);
    return NextResponse.json({ received: true });
  }
}
