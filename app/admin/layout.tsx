import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminSidebar from './_components/sidebar';

export const metadata = { title: 'NEXUS Admin' };

const TEAM_ROLES = ['admin', 'manager', 'marketing', 'it', 'support', 'editor', 'trainee'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin');
  }

  // Allow admin OR any valid team role (middleware handles path-level restrictions)
  const userRole = (session.user as { role?: string }).role?.toLowerCase() || 'user';
  if (!TEAM_ROLES.includes(userRole)) {
    redirect('/');
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
