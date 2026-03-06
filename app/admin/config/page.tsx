'use client';

import { useEffect, useState, useRef } from 'react';

type AgentConfig = Record<string, any>;

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
      // no need to replace local state; keep UI in sync with the last local config
      setSaved(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('configUpdated'));
      }
    } catch {
      setError('Failed to save config');
    }
    setSaving(false);
  };

  // Agent prompt editing
  const agentPrompts = config.agentPrompts || {};
  let agentList = config.agentList || [];
  // if agentList missing or empty, build from prompts keys
  if (agentList.length === 0 && Object.keys(agentPrompts).length > 0) {
    agentList = Object.keys(agentPrompts).map((name) => ({ name, prompt: agentPrompts[name], skills: [] }));
  }
  const [selectedAgentName, setSelectedAgentName] = useState(agentList[0]?.name || '');
  useEffect(() => {
    if (agentList.length > 0 && !agentList.find((a: any) => a.name === selectedAgentName)) {
      setSelectedAgentName(agentList[0].name);
    }
  }, [agentList, selectedAgentName]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(save, 300);
  };

  const updateAgentPrompt = (name: string, prompt: string) => {
    setConfig((c) => ({ ...c, agentPrompts: { ...agentPrompts, [name]: prompt } }));
    setSaved(false);
    debouncedSave();
  };

  const updateAgentSkills = (name: string, skills: string) => {
    const list = agentList.map((a: any) =>
      a.name === name ? { ...a, skills: skills.split(',').map((s) => s.trim()).filter(Boolean) } : a
    );
    setConfig((c) => ({ ...c, agentList: list }));
    setSaved(false);
    debouncedSave();
  };

  const renameAgent = (oldName: string, newName: string) => {
    if (!newName || oldName === newName) return;
    const newPrompts = { ...agentPrompts };
    newPrompts[newName] = newPrompts[oldName];
    delete newPrompts[oldName];
    const newList = agentList.map((a: any) =>
      a.name === oldName ? { ...a, name: newName } : a
    );
    setConfig((c) => ({ ...c, agentPrompts: newPrompts, agentList: newList }));
    setSaved(false);
    debouncedSave();
  };

  const deleteAgent = (name: string) => {
    const newPrompts = { ...agentPrompts };
    delete newPrompts[name];
    const newList = agentList.filter((a: any) => a.name !== name);
    setConfig((c) => ({ ...c, agentPrompts: newPrompts, agentList: newList }));
    setSaved(false);
    debouncedSave();
  };

  const addAgent = () => {
    if (!newAgentName) return;
    setConfig((c) => ({
      ...c,
      agentList: [...agentList, { name: newAgentName, prompt: newAgentPrompt, enabled: true, skills: [], schedule: '' }],
      agentPrompts: { ...agentPrompts, [newAgentName]: newAgentPrompt },
    }));
    setSelectedAgentName(newAgentName);
    setNewAgentName('');
    setNewAgentPrompt('');
    setSaved(false);
    debouncedSave();
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Agent Configuration</h1>
        <p className="text-slate-500 text-sm mt-0.5">Edit agent prompts, create new agents, and save runtime settings</p>
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
        ) : (
          <>
            {/* Agent prompt editing */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-2">Edit Agent Prompts</h2>
              <div className="mb-4">
                <select
                  value={selectedAgentName}
                  onChange={(e) => setSelectedAgentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                >
                  <option value="">-- select agent --</option>
                  {agentList.map((a: any) => (
                    <option key={a.name} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                {agentList
                  .filter((a: any) => a.name === selectedAgentName)
                  .map((a: any) => (
                    <div key={a.name} className="border border-slate-700 rounded-xl p-4 bg-slate-800">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {a.name}
                        </label>
                        <input
                          type="text"
                          defaultValue={a.name}
                          onBlur={(e) => renameAgent(a.name, e.target.value)}
                          className="bg-slate-700 text-white rounded px-2 py-1 text-xs border border-slate-600 focus:border-cyan-500 focus:outline-none"
                          style={{ width: '120px' }}
                        />
                        <label className="flex items-center ml-2 text-xs">
                          <input
                            type="checkbox"
                            checked={!!a.enabled}
                            onChange={(e) => {
                              a.enabled = e.target.checked;
                              setConfig((c) => ({ ...c, agentList }));
                              setSaved(false);
                              setTimeout(save,0);
                            }}
                            className="mr-1"
                          />
                          Enabled
                        </label>
                        <button
                          type="button"
                          onClick={() => deleteAgent(a.name)}
                          className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-400 text-white text-xs rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      <textarea
                        value={agentPrompts[a.name] || ''}
                        onChange={(e) => updateAgentPrompt(a.name, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500 mb-2"
                        rows={3}
                        placeholder={`Prompt for ${a.name}`}
                      />
                      <input
                        type="text"
                        value={(a.skills || []).join(', ')}
                        onChange={(e) => updateAgentSkills(a.name, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors mb-2"
                        placeholder="Skills (comma separated)"
                      />
                      <input
                        type="text"
                        value={a.schedule || ''}
                        onChange={(e) => {
                          a.schedule = e.target.value;
                          setConfig((c) => ({ ...c, agentList }));
                          setSaved(false);
                          setTimeout(save,0);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="Cron schedule (optional)"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Agent creation */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-2">Create New Agent</h2>
              <div className="space-y-2">
                <input
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
                  placeholder="Agent Name"
                />
                <textarea
                  value={newAgentPrompt}
                  onChange={(e) => setNewAgentPrompt(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
                  rows={3}
                  placeholder="Agent Prompt"
                />
                <button
                  type="button"
                  onClick={addAgent}
                  className="mt-2 px-5 py-2 bg-green-500 hover:bg-green-400 text-black text-sm font-semibold rounded-xl transition-colors"
                >
                  Add Agent
                </button>
              </div>
            </div>

            {/* Other config fields */}
            <div className="space-y-4">
              {Object.entries(config)
                .filter(([key]) => key !== 'agentPrompts' && key !== 'agentList')
                .map(([key, val]) => (
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
          </>
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
