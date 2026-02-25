import ProfileSection from '@/components/profile-section';
import { Navbar } from '@/components/navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/signin');
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        <ProfileSection />
      </div>
    </main>
  );
}
