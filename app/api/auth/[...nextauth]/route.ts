import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/src/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
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

        // simple passwordless login: if user exists, return it; otherwise create
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          user = await prisma.user.create({ data: { email: credentials.email } });
        }
        return user as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        // stamp isAdmin once at sign-in time.  set ADMIN_EMAIL (server-only)
        // in your environment.  an absent value means no one is admin.
        const adminEmail = process.env.ADMIN_EMAIL;
        token.isAdmin = user.email === adminEmail;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.email = token.email;
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