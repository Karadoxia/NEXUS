// ============================================================
// NEXUS STORE — EMAIL SERVICE (Resend)
// File: lib/email.ts
//
// Install: npm install resend
// Set env: RESEND_API_KEY and EMAIL_FROM in .env.local
// Sign up free at: https://resend.com
// ============================================================

import { Resend } from 'resend'
import { CartItem, Address } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'NEXUS Store <orders@nexus-store.io>'

// ─── ORDER CONFIRMATION ────────────────────────────────────
export async function sendOrderConfirmationEmail({
  orderId,
  email,
  name,
  items,
  total,
  address,
}: {
  orderId: string
  email: string
  name: string
  items: CartItem[]
  total: number
  address: Address
}) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
          <strong style="color:#ffffff;font-size:14px;">${item.name}</strong>
          <br/><span style="color:#6b7280;font-size:12px;">${item.brand} • Qty: ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;text-align:right;">
          <strong style="color:#06b6d4;">€${(item.price * item.quantity).toFixed(2)}</strong>
        </td>
      </tr>
    `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order Confirmed — NEXUS</title>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                <tr>
                  <td style="background:linear-gradient(135deg,#06b6d4,#9333ea);border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="color:#000;font-weight:800;font-size:18px;">N</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-weight:800;font-size:22px;letter-spacing:-1px;">NEXUS</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:40px;text-align:center;margin-bottom:24px;">
              <div style="font-size:48px;margin-bottom:16px;">✅</div>
              <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">Order Confirmed!</h1>
              <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">Hey ${name}, your order is being processed.</p>
              <div style="background:#111111;border:1px solid #1f2937;border-radius:10px;padding:16px;display:inline-block;">
                <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order ID</span>
                <br/>
                <span style="color:#06b6d4;font-family:monospace;font-size:16px;font-weight:700;">${orderId}</span>
              </div>
            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

          <!-- Items -->
          <tr>
            <td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">
              <h2 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 20px;">Order Summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
                <tr>
                  <td style="padding-top:16px;">
                    <strong style="color:#ffffff;font-size:15px;">Total</strong>
                  </td>
                  <td style="padding-top:16px;text-align:right;">
                    <strong style="color:#06b6d4;font-size:20px;">€${total.toFixed(2)}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

          <!-- Shipping Address -->
          <tr>
            <td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">
              <h2 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 16px;">📦 Shipping To</h2>
              <p style="color:#9ca3af;font-size:14px;margin:0;line-height:1.8;">
                ${address.fullName}<br/>
                ${address.line1}${address.line2 ? '<br/>' + address.line2 : ''}<br/>
                ${address.postalCode} ${address.city}<br/>
                ${address.country}
              </p>
            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

          <!-- What's next -->
          <tr>
            <td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">
              <h2 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 20px;">What Happens Next?</h2>
              ${[
      ['🔄', 'Processing', 'We\'re preparing your order (usually within a few hours)'],
      ['📦', 'Dispatch', 'Your order ships within 24h with tracking number'],
      ['🚀', 'Delivery', 'Expected 2–5 business days for EU. You\'ll get a tracking email.'],
    ].map(([icon, title, desc]) => `
                <div style="display:flex;align-items:flex-start;margin-bottom:16px;">
                  <span style="font-size:20px;margin-right:12px;">${icon}</span>
                  <div>
                    <strong style="color:#ffffff;font-size:14px;">${title}</strong>
                    <br/><span style="color:#6b7280;font-size:13px;">${desc}</span>
                  </div>
                </div>
              `).join('')}
            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

          <!-- CTA -->
          <tr>
            <td style="text-align:center;padding:8px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" style="display:inline-block;background:#06b6d4;color:#000000;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
                Track Your Order →
              </a>
            </td>
          </tr>

          <tr><td style="height:40px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;border-top:1px solid #1a1a1a;padding-top:24px;">
              <p style="color:#374151;font-size:12px;margin:0 0 8px;">
                Questions? <a href="mailto:orders@nexus-store.io" style="color:#06b6d4;">orders@nexus-store.io</a>
              </p>
              <p style="color:#374151;font-size:12px;margin:0;">
                © 2026 NEXUS Technologies · Boulogne-Billancourt, France
              </p>
              <p style="margin:12px 0 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" style="color:#374151;font-size:11px;text-decoration:underline;">View in browser</a>
                &nbsp;·&nbsp;
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color:#374151;font-size:11px;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `✅ Order Confirmed — ${orderId} | NEXUS`,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email service error:', err)
    return { success: false, error: err }
  }
}

// ─── SHIPPING NOTIFICATION ─────────────────────────────────
export async function sendShippingEmail({
  email,
  name,
  orderId,
  trackingNumber,
  carrier,
  trackingUrl,
}: {
  email: string
  name: string
  orderId: string
  trackingNumber: string
  carrier: string
  trackingUrl: string
}) {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px 20px;background:#000;font-family:Helvetica,Arial,sans-serif;">
  <table width="600" style="max-width:600px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:40px;">
    <tr>
      <td style="text-align:center;padding-bottom:32px;">
        <span style="font-size:48px;">🚀</span>
        <h1 style="color:#fff;font-size:24px;margin:16px 0 8px;">Your Order Is On Its Way!</h1>
        <p style="color:#6b7280;margin:0;">Hey ${name}, your NEXUS order has shipped.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#111;border:1px solid #1f2937;border-radius:12px;padding:24px;text-align:center;">
        <p style="color:#6b7280;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Tracking Number</p>
        <p style="color:#06b6d4;font-family:monospace;font-size:20px;font-weight:700;margin:0 0 8px;">${trackingNumber}</p>
        <p style="color:#6b7280;font-size:13px;margin:0 0 20px;">Carrier: ${carrier}</p>
        <a href="${trackingUrl}" style="background:#06b6d4;color:#000;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
          Track Package →
        </a>
      </td>
    </tr>
    <tr>
      <td style="text-align:center;padding-top:24px;">
        <p style="color:#374151;font-size:12px;">Order: <span style="color:#06b6d4;">${orderId}</span></p>
        <p style="color:#374151;font-size:12px;">© 2026 NEXUS Technologies</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `📦 Your NEXUS order has shipped! Track: ${trackingNumber}`,
    html,
  })
}

// ─── HOW TO USE THESE FUNCTIONS ────────────────────────────
//
// In your Stripe webhook (app/api/webhooks/stripe/route.ts):
//
// case 'payment_intent.succeeded': {
//   const pi = event.data.object
//   const items = JSON.parse(pi.metadata.items)
//   await sendOrderConfirmationEmail({
//     orderId: pi.id,
//     email: pi.receipt_email,
//     name: pi.shipping?.name ?? 'Customer',
//     items,
//     total: pi.amount / 100,
//     address: pi.shipping?.address,
//   })
//   break
// }

// ─── NEWSLETTER WELCOME ─────────────────────────────────────
export async function sendWelcomeEmail({ email }: { email: string }) {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://nexus-store.io';
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px 20px;background:#000;font-family:Helvetica,Arial,sans-serif;">
  <table width="600" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="text-align:center;padding-bottom:32px;">
        <table cellpadding="0" cellspacing="0" style="display:inline-table;">
          <tr>
            <td style="background:linear-gradient(135deg,#06b6d4,#9333ea);border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
              <span style="color:#000;font-weight:800;font-size:18px;">N</span>
            </td>
            <td style="padding-left:10px;">
              <span style="color:#fff;font-weight:800;font-size:22px;letter-spacing:-1px;">NEXUS</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;padding:40px;text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">🎉</div>
        <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 12px;">Welcome to the NEXUS Community!</h1>
        <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 24px;">
          You're in. Every week we'll send you the latest products, exclusive deals,
          and the top AI news — straight to your inbox.
        </p>
        <a href="${appUrl}/store" style="display:inline-block;background:linear-gradient(135deg,#06b6d4,#9333ea);color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;">
          Explore the Store →
        </a>
      </td>
    </tr>
    <tr>
      <td style="text-align:center;padding-top:24px;">
        <p style="color:#374151;font-size:12px;margin:0;">
          © 2026 NEXUS Technologies &nbsp;·&nbsp;
          <a href="${appUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#374151;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: '🎉 Welcome to the NEXUS Community!',
      html,
    });
    if (error) { console.error('[email] welcome send error:', error); return { success: false, error }; }
    return { success: true, data };
  } catch (err) {
    console.error('[email] welcome service error:', err);
    return { success: false, error: err };
  }
}

// ─── NEWSLETTER BULK SEND ───────────────────────────────────
export async function sendNewsletterEmail({
  subscribers,
  subject,
  html,
}: {
  subscribers: string[];
  subject: string;
  html: string;
}) {
  const results = { sent: 0, failed: 0, errors: [] as string[] };
  for (const email of subscribers) {
    try {
      const { error } = await resend.emails.send({ from: FROM, to: email, subject, html });
      if (error) { results.failed++; results.errors.push(`${email}: ${JSON.stringify(error)}`); }
      else results.sent++;
    } catch (e: any) {
      results.failed++;
      results.errors.push(`${email}: ${e.message}`);
    }
  }
  return results;
}
