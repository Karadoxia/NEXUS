'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Rule = { label: string; test: (p: string) => boolean };

const PASSWORD_RULES: Rule[] = [
  { label: 'At least 8 characters',            test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A–Z)',        test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a–z)',        test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0–9)',                  test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$%^&*)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignUpPage() {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showRules, setShowRules] = useState(false);
  const router = useRouter();

  const rulesOk  = PASSWORD_RULES.every((r) => r.test(password));
  const matchOk  = password === confirm && confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rulesOk) {
      setError('Password does not meet all requirements.');
      return;
    }
    if (!matchOk) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // 1. Register account
    const regRes = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const regData = await regRes.json();
    if (!regRes.ok) {
      setLoading(false);
      setError(regData.error || 'Registration failed.');
      return;
    }

    // 2. Auto sign-in after successful registration
    const signRes = await signIn('credentials', { redirect: false, email, password });
    setLoading(false);
    if (signRes?.ok) {
      router.push('/');
    } else {
      setError('Account created! Please sign in.');
      router.push('/signin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            NEXUS
          </h1>
          <p className="text-zinc-400 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setShowRules(true); }}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
            />
            {showRules && (
              <ul className="mt-2 space-y-1">
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(password);
                  return (
                    <li key={r.label} className={`text-xs flex items-center gap-1.5 ${ok ? 'text-green-400' : 'text-zinc-500'}`}>
                      <span>{ok ? '✓' : '○'}</span>
                      {r.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800 border text-white placeholder-zinc-500 focus:outline-none transition ${
                confirm.length > 0 ? (matchOk ? 'border-green-500' : 'border-red-500') : 'border-zinc-700 focus:border-cyan-500'
              }`}
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !rulesOk || !matchOk}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-black font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
