import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();
    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'missing parameters' }, { status: 400 });
    }
    const result = await sendEmail({ to, subject, html });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[mail POST]', err);
    return NextResponse.json({ error: err.message || 'send failed' }, { status: 500 });
  }
}
