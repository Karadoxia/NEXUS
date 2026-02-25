import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/navbar';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(session.user as any).isAdmin) {
    redirect('/signin');
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 1000,
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">Clients</h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-800">
                <th className="py-2 px-4 text-left text-sm">Email</th>
                <th className="py-2 px-4 text-left text-sm">Name</th>
                <th className="py-2 px-4 text-left text-sm">Phone</th>
                <th className="py-2 px-4 text-left text-sm">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-700 hover:bg-slate-900">
                  <td className="py-2 px-4 text-sm break-all">{u.email}</td>
                  <td className="py-2 px-4 text-sm">{u.name || '-'}</td>
                  <td className="py-2 px-4 text-sm">{u.phone || '-'}</td>
                  <td className="py-2 px-4 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
