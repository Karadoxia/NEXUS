import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

// Note: PrismaAdapter is intentionally omitted because we use the JWT session
// strategy which manages state entirely in the signed cookie.  Mixing
// PrismaAdapter with strategy:'jwt' causes the adapter to create stale
// Account/Session rows in the DB that are never read back.

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) return null;

        // 5 login attempts per email per minute to slow brute-force / enumeration
        if (!checkRateLimit(`auth:${credentials.email}`, 5, 60_000)) {
          throw new Error('Too many login attempts. Please wait a minute and try again.');
        }

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });

        // User not found
        if (!user) {
          throw new Error('No account found with this email. Please register first.');
        }

        // Legacy passwordless account — block until user sets a password via /forgot-password
        if (!user.hashedPassword) {
          throw new Error('Please create a new account with a password. Passwordless accounts are no longer supported.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          throw new Error('Incorrect password. Please try again.');
        }

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        // Stamp isAdmin once at sign-in time.  Set ADMIN_EMAIL (server-only)
        // in your environment.  An absent value means no one is admin.
        token.isAdmin = user.email === (process.env.ADMIN_EMAIL ?? '');
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ?? '';
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
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
