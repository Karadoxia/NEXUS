'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // reuse credentials provider for signup (creates user if none exists)
    const res = await signIn('credentials', {
      redirect: false,
      email,
    });
    if (res?.ok) {
      router.push('/');
    } else {
      alert('Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold">Create Account</h2>
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
          className="w-full py-2 px-4 bg-green-500 rounded-lg text-black font-semibold"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        Already have an account? <a href="/signin" className="text-cyan-400 underline">Sign in</a>
      </p>
    </div>
  );
}
