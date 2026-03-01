import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkRateLimit, getRequestIp } from '@/lib/rate-limit';

// Role-based access control: which paths each role can access
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin:     ['*'],  // all paths
  manager:   ['/admin', '/admin/orders', '/admin/users', '/admin/clients', '/admin/newsletter', '/admin/performance'],
  marketing: ['/admin', '/admin/products', '/admin/newsletter', '/admin/performance'],
  it:        ['/admin', '/admin/tools', '/admin/logs', '/admin/config', '/admin/monitoring'],
  support:   ['/admin', '/admin/orders', '/admin/users', '/admin/clients'],
  editor:    ['/admin', '/admin/products', '/admin/newsletter'],
  trainee:   ['/admin'],
};

function hasPathAccess(role: string, pathname: string): boolean {
  const allowedPaths = ROLE_PERMISSIONS[role];
  if (!allowedPaths) return false;
  if (allowedPaths.includes('*')) return true;
  return allowedPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
}

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

    // Admin pages require either isAdmin=true OR a team role with path access
    const isAdmin = token.isAdmin as boolean;
    const role = (token.role as string)?.toLowerCase() || 'user';

    if (isAdmin) {
      // Full access
      return NextResponse.next();
    }

    // Check team role permissions
    if (hasPathAccess(role, pathname)) {
      return NextResponse.next();
    }

    // No access
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
