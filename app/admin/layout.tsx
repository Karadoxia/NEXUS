import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminSidebar from './_components/sidebar';

export const metadata = { title: 'NEXUS Admin' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !(session.user as { isAdmin?: boolean }).isAdmin) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-[#080f1c] text-white flex">
      <AdminSidebar userEmail={session.user.email} />
      {/* Main content offset by sidebar width */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
