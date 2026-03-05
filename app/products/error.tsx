'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Products page error:', error);
    // Auto-redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-2">Products Error</h1>
        <p className="text-slate-400 mb-6">
          Failed to load products. Redirecting you to the home page in 5 seconds...
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go Home Now
          </button>
          <button
            onClick={reset}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
