import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // protect /admin routes
  if (pathname.startsWith('/admin')) {
    const cookie = request.cookies.get('next-auth.session-token') || request.cookies.get('next-auth.session');
    if (!cookie) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
