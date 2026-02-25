import ProfileSection from '@/components/profile-section';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    // if not signed in, send to signin page
    redirect('/signin');
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <ProfileSection />
    </div>
  );
}