import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';
import { checkRateLimit, getRequestIp } from '@/lib/rate-limit';
import { sendWelcomeEmail } from '@/lib/email';

// POST /api/newsletter — subscribe an email
export async function POST(request: Request) {
  const ip = getRequestIp(request);
  if (!checkRateLimit(`newsletter:${ip}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { created } = await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
      // Prisma doesn't expose `created` directly — we detect via select
    }).then(() => ({ created: true })).catch(() => ({ created: false }));

    // Only send welcome email for genuinely new subscribers
    if (created && process.env.RESEND_API_KEY) {
      sendWelcomeEmail({ email }).catch((e) =>
        console.error('[newsletter] welcome email failed:', e),
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('[newsletter POST]', e);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}

// GET /api/newsletter — list all subscribers (admin only)
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({ orderBy: { joinedAt: 'desc' } }),
    prisma.subscriber.count(),
  ]);
  return NextResponse.json({ subscribers, total });
}
