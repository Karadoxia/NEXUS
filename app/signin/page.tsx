'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
    });
    if (res?.ok) {
      router.push('/');
    } else {
      alert('Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-cyan-500 rounded-lg text-black font-semibold"
        >
          Sign In / Register
        </button>
      </form>
    </div>
  );
}
