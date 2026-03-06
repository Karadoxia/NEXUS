import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { cartItems } = await request.json() as {
      cartItems: { name: string; price: number; quantity: number }[];
    };

    if (!cartItems?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Compute total server-side from cart items
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create pending order in DB
    const order = await prisma.order.create({
      data: {
        total: parseFloat(total.toFixed(2)),
        status: 'pending',
        userId: session?.user?.id ?? null,
        items: {
          create: cartItems.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            product: { connect: { slug: 'unknown' } }, // product lookup handled client-side
          })),
        },
      },
    });

    const token = await getPayPalToken();
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: order.id,
          amount: {
            currency_code: 'EUR',
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'EUR', value: total.toFixed(2) },
            },
          },
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: String(item.quantity),
            unit_amount: { currency_code: 'EUR', value: item.price.toFixed(2) },
          })),
        }],
        application_context: {
          brand_name: 'NEXUS 2027',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const paypalOrder = await res.json();
    if (!paypalOrder.id) {
      console.error('[paypal/create-order] PayPal error:', paypalOrder);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    return NextResponse.json({ paypalOrderId: paypalOrder.id, nexusOrderId: order.id });
  } catch (err) {
    console.error('[paypal/create-order]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
