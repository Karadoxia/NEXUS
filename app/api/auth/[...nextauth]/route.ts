import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';
import { checkRateLimitSimple } from '@/lib/rate-limit';
import { getPrismaHR } from '@/src/lib/prisma-hr';

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
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[AUTH] Checking credentials structure');
        if (!credentials?.email || !credentials?.password) return null;
        if (!/^[^\s@]+@[^\s@]+$/.test(credentials.email)) return null;

        console.log('[AUTH] Checking rate limit');
        // 5 login attempts per email per minute to slow brute-force / enumeration
        const rateLimitOk = await checkRateLimitSimple(`auth:${credentials.email}`, 5, 60_000);
        if (!rateLimitOk) {
          throw new Error('Too many login attempts. Please wait a minute and try again.');
        }

        console.log('[AUTH] Checking HR DB');
        // 1. Check HR database first (employees/admins)
        try {
          const client = getPrismaHR();
          console.log('[AUTH] Running employee DB query');
          const result = await client.query(
            'SELECT * FROM "Employee" WHERE email = $1',
            [credentials.email]
          );
          console.log('[AUTH] query finished');
          const employee = result.rows[0];

          if (employee) {
            console.log('[AUTH] Employee found, comparing password');
            if (!employee.isActive) {
              throw new Error('Account is deactivated.');
            }
            const isValid = await bcrypt.compare(credentials.password, employee.hashedPassword);
            console.log('[AUTH] Password compare finished');
            if (!isValid) {
              throw new Error('Incorrect password. Please try again.');
            }
            // Update lastLogin
            console.log('[AUTH] Updating lastLogin');
            await client.query(
              'UPDATE "Employee" SET "lastLogin" = NOW() WHERE id = $1',
              [employee.id]
            );
            return {
              id: employee.id,
              email: employee.email,
              name: employee.name,
              role: employee.role.toLowerCase()
            };
          }
        } catch (e: any) {
          // If HR DB is unavailable, fall through to customer table
          console.log('[AUTH] HR db check failed', e);
        }

        console.log('[AUTH] Falling through to Customer table Prisma check');
        // 2. Fall through: check customer User table
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        console.log('[AUTH] Customer findUnique resolved, user found:', !!user);

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

        return { id: user.id, email: user.email, name: user.name ?? undefined, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        // Stamp isAdmin and role from user object returned by authorize
        const userWithRole = user as { role?: string };
        token.isAdmin = userWithRole.role === 'admin' || userWithRole.role === 'superadmin';
        token.role = userWithRole.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub ?? '';
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
        session.user.role = (token.role as string) ?? 'user';
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
