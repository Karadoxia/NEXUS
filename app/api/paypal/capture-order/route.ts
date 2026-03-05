import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const { paypalOrderId, nexusOrderId } = await request.json() as {
      paypalOrderId: string;
      nexusOrderId: string;
    };

    const token = await getPayPalToken();
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const capture = await res.json();

    if (capture.status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: nexusOrderId },
        data: { status: 'paid' },
      });

      return NextResponse.json({ success: true, orderId: nexusOrderId });
    }

    console.error('[paypal/capture] Not completed:', capture);
    return NextResponse.json({ error: 'Payment not completed', details: capture }, { status: 400 });
  } catch (err) {
    console.error('[paypal/capture]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
