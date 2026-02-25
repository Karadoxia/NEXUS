'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';

export default function AdminConfigPage() {
  const { data: session } = useSession();
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      try {
        const res = await fetch('/api/agents/config');
        if (!res.ok) throw new Error('failed');
        setConfig(await res.json());
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchConfig();
  }, []);

  const updateField = (key: string, value: any) => {
    setConfig((c: any) => ({ ...c, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/agents/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('save failed');
      setConfig(await res.json());
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

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
        <h1 className="text-3xl font-bold mb-6">Agent Configuration</h1>
        {loading && <p>Loading...</p>}
        {!loading && (
          <div className="space-y-4">
            {Object.keys(config).map((key) => (
              <div key={key} className="flex items-center gap-4">
                <label className="w-48 text-sm text-slate-400">{key}</label>
                <input
                  className="flex-1 bg-slate-800 text-white rounded px-2 py-1"
                  value={config[key] ?? ''}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              </div>
            ))}
            <button
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded"
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
