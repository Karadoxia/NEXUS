'use client';

import { useState } from 'react';

export function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            } else {
                setStatus('success');
                setMessage("You're in. Welcome to the Network.");
                setEmail('');
            }
        } catch {
            setStatus('error');
            setMessage('Connection error. Try again.');
        }
    };

    return (
        <section className="py-20 border-t border-cyan-900/30 bg-gradient-to-b from-black to-cyan-950/20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400 mb-4 tracking-tighter">
                    JOIN THE NEXUS NETWORK
                </h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                    Get early access to new drops, exclusive B2B deals, and tech intel before anyone else.
                </p>

                {status === 'success' ? (
                    <div className="max-w-md mx-auto py-4 px-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 bg-black/50 border border-cyan-900 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all"
                        >
                            {status === 'loading' ? '...' : 'JOIN'}
                        </button>
                    </form>
                )}

                {status === 'error' && (
                    <p className="mt-3 text-sm text-red-400">{message}</p>
                )}
            </div>
        </section>
    );
}
