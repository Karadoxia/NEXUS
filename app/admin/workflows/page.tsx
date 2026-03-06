'use client';

import { useEffect, useState } from 'react';
import { Workflow, RefreshCw, ExternalLink, Play, Pause, AlertCircle } from 'lucide-react';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/n8n-workflows');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWorkflows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const active   = workflows.filter((w) => w.active).length;
  const inactive = workflows.length - active;

  return (
    <div className="p-8 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">n8n Workflows</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Loading…' : `${workflows.length} workflows — ${active} active, ${inactive} inactive`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="http://nexus-n8n.local/home/workflows"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors"
          >
            Open n8n
            <ExternalLink size={11} className="opacity-60" />
          </a>
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-3 py-2 rounded-xl transition-colors disabled:opacity-40"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-300">Failed to load workflows</p>
            <p className="text-xs text-slate-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Stats strip */}
      {!loading && !error && workflows.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total',    value: workflows.length, color: 'text-white',       ring: 'bg-slate-800 border-slate-700' },
            { label: 'Active',   value: active,           color: 'text-green-400',   ring: 'bg-green-500/10 border-green-500/20' },
            { label: 'Inactive', value: inactive,         color: 'text-slate-400',   ring: 'bg-slate-800 border-slate-700' },
          ].map(({ label, value, color, ring }) => (
            <div key={label} className={`${ring} border rounded-2xl p-5`}>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && !error && workflows.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/40">
                {['Workflow', 'Status', 'Created', 'Last Updated'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {workflows.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`p-1.5 rounded-lg border ${w.active ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        <Workflow size={13} />
                      </span>
                      <span className="text-slate-200 font-medium group-hover:text-white transition-colors">{w.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border uppercase ${
                      w.active
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {w.active ? <Play size={9} /> : <Pause size={9} />}
                      {w.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(w.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(w.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && workflows.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Workflow size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No workflows found in n8n</p>
        </div>
      )}
    </div>
  );
}
