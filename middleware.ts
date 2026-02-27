import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkRateLimit, getRequestIp } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const ip = getRequestIp(request);
  // global rate limit: 100 requests per minute per IP
  if (!checkRateLimit(`global:${ip}`, 100, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    // Verify the JWT signature and expiry — a cookie that merely exists is not proof of auth.
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    // Admin pages require the isAdmin flag stamped at sign-in time.
    if (!token.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
