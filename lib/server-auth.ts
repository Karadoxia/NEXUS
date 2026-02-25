import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

/**
 * Returns the session if the request is authenticated, otherwise returns
 * an error response. Use the returned `error` field to short-circuit the
 * route handler.
 *
 * @example
 * const { session, error } = await requireAuth();
 * if (error) return error;
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { session, error: null };
}

/**
 * Returns the session if the request is authenticated AND the user is an
 * admin (isAdmin === true in the JWT). Otherwise returns an error response.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  if (!(session.user as any).isAdmin) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }
  return { session, error: null };
}
