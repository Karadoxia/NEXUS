import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';
import { redirect } from 'next/navigation';
import AdminUsersClient from './admin-users-client';

const PAGE_SIZE = 50;

type Props = {
  searchParams: Promise<{ q?: string; page?: string; role?: string }>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(session.user as { isAdmin?: boolean }).isAdmin) {
    redirect('/signin');
  }

  const { q, page: pageStr, role } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } },
    ];
  }

  let users: any[] = [];
  let total = 0;

  try {
    [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.user.count({ where }),
    ]);
  } catch (err: any) {
    console.error('Unable to fetch users (Prisma error):', err);
    return (
      <div className="p-8">
        <p className="text-red-400 font-semibold mb-2">Database schema is out of date.</p>
        <p className="text-sm">
          Please run <code className="bg-slate-800 px-1 py-0.5 rounded">npx prisma migrate dev</code> and then
          <code className="bg-slate-800 px-1 py-0.5 rounded">npx prisma generate</code>,
          restart the dev server and reload this page.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminUsersClient
      users={users}
      total={total}
      totalPages={totalPages}
      page={page}
      q={q}
      roleFilter={role}
    />
  );
}
