'use client';

import { useEffect, useState } from 'react';

type AgentConfig = Record<string, string>;

export default function AdminConfigPage() {
  const [config, setConfig]   = useState<AgentConfig>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch('/api/agents/config');
        if (!r.ok) throw new Error('failed');
        setConfig(await r.json());
      } catch {
        setError('Failed to load config');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateField = (key: string, value: string) => {
    setSaved(false);
    setConfig((c) => ({ ...c, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const r = await fetch('/api/agents/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!r.ok) throw new Error('save failed');
      setConfig(await r.json());
      setSaved(true);
    } catch {
      setError('Failed to save config');
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Agent Configuration</h1>
        <p className="text-slate-500 text-sm mt-0.5">Edit and save agent runtime settings</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
          Config saved successfully
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        {loading ? (
          <p className="text-slate-500 text-sm text-center py-8">Loading…</p>
        ) : Object.keys(config).length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No config keys found</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(config).map(([key, val]) => (
              <div key={key}>
                <label
                  htmlFor={`cfg-${key}`}
                  className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider"
                >
                  {key}
                </label>
                <input
                  id={`cfg-${key}`}
                  value={val ?? ''}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && Object.keys(config).length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Config'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
