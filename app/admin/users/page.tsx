import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(session.user as { isAdmin?: boolean }).isAdmin) {
    redirect('/signin');
  }

  // Note: User model has no createdAt — order by email for stable ordering
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, phone: true },
    orderBy: { email: 'asc' },
    take: 1000,
  });

  return (
    <div className="p-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-slate-500 text-sm mt-0.5">{users.length.toLocaleString()} registered users</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Email', 'Name', 'Phone'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-14 text-center text-slate-500">
                    No users registered yet
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 text-slate-300 break-all">{u.email}</td>
                    <td className="px-5 py-3 text-slate-400">{u.name ?? <span className="text-slate-600">—</span>}</td>
                    <td className="px-5 py-3 text-slate-400">{u.phone ?? <span className="text-slate-600">—</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
