import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';
import { checkRateLimit, getRequestIp } from '@/lib/rate-limit';

// POST /api/newsletter — subscribe an email
export async function POST(request: Request) {
  // 10 attempts per IP per 10 minutes to prevent subscription spam
  const ip = getRequestIp(request);
  if (!checkRateLimit(`newsletter:${ip}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await prisma.subscriber.upsert({
      where: { email },
      update: {}, // already subscribed — no-op
      create: { email },
    });

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

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { joinedAt: 'desc' },
  });
  return NextResponse.json(subscribers);
}
