'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';

interface PerfEntry {
  id: string;
  timestamp: string;
  orders: number;
  returns: number;
  downtime: boolean;
  notes?: string;
}

export default function AdminPerformancePage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<PerfEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/agents/performance');
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        setEntries(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <p className="text-red-400">Unauthorized</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">Performance History</h1>
        {loading && <p>Loading...</p>}
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-2">Time</th>
              <th className="p-2">Orders</th>
              <th className="p-2">Returns</th>
              <th className="p-2">Downtime</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-slate-800 hover:bg-slate-900">
                <td className="p-2 font-mono text-sm">{new Date(e.timestamp).toLocaleString()}</td>
                <td className="p-2 text-sm">{e.orders}</td>
                <td className="p-2 text-sm">{e.returns}</td>
                <td className="p-2 text-sm">{e.downtime ? 'YES' : 'no'}</td>
                <td className="p-2 text-sm">{e.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
