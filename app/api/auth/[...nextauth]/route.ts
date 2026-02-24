import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/src/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'jwt' as const,
  },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
      },
      async authorize(credentials, req) {
        // simple passwordless login: if user exists, return it; otherwise create
        if (!credentials?.email) return null;
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          user = await prisma.user.create({ data: { email: credentials.email } });
        }
        return user as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: { session: any; token: any; user: any }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.email = token.email;
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