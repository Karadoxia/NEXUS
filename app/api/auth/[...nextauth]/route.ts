import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/src/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

// Note: PrismaAdapter is intentionally omitted because we use the JWT session
// strategy which manages state entirely in the signed cookie.  Mixing
// PrismaAdapter with strategy:'jwt' causes the adapter to create stale
// Account/Session rows in the DB that are never read back.

export const authOptions = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) return null;

        // 5 login attempts per email per minute to slow brute-force / enumeration
        if (!checkRateLimit(`auth:${credentials.email}`, 5, 60_000)) {
          throw new Error('Too many login attempts. Please wait a minute and try again.');
        }

        // Passwordless login: find or create the user
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          user = await prisma.user.create({ data: { email: credentials.email } });
        }
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string; email: string } }) {
      if (user) {
        // Stamp isAdmin once at sign-in time.  Set ADMIN_EMAIL (server-only)
        // in your environment.  An absent value means no one is admin.
        token.isAdmin = user.email === (process.env.ADMIN_EMAIL ?? '');
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.sub ?? '';
        session.user.isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };