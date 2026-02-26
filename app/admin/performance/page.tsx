'use client';

import { useEffect, useState } from 'react';

interface PerfEntry {
  id: string;
  timestamp: string;
  orders: number;
  returns: number;
  downtime: boolean;
  notes?: string;
}

export default function AdminPerformancePage() {
  const [entries, setEntries] = useState<PerfEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/agents/performance');
        if (!r.ok) throw new Error('Failed to load');
        const data: PerfEntry[] = await r.json();
        setEntries(data);
      } catch {
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Performance History</h1>
        <p className="text-slate-500 text-sm mt-0.5">Agent cycle metrics over time</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Time', 'Orders', 'Returns', 'Return %', 'Downtime', 'Notes'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">Loading…</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">No data yet</td>
                </tr>
              ) : (
                entries.map((e) => {
                  const rate = e.orders > 0 ? ((e.returns / e.orders) * 100).toFixed(1) : '—';
                  return (
                    <tr key={e.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {new Date(e.timestamp).toLocaleString('en', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3 text-white font-semibold tabular-nums">{e.orders}</td>
                      <td className="px-5 py-3 text-slate-300 tabular-nums">{e.returns}</td>
                      <td className="px-5 py-3 tabular-nums">
                        <span className={parseFloat(rate) > 10 ? 'text-red-400' : 'text-slate-400'}>
                          {rate !== '—' ? `${rate}%` : rate}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {e.downtime ? (
                          <span className="text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded">YES</span>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs max-w-[240px] truncate">
                        {e.notes ?? '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
