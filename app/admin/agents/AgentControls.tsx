'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentControls() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [agentEndpoints, setAgentEndpoints] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // fetch dynamic agent list from config
    const load = async () => {
      try {
        const res = await fetch('/api/agents/config');
        if (!res.ok) return;
        const cfg = await res.json();
        const list = cfg.agentList || [];
        const endpoints = list.map((a: any) => ({
          name: a.name,
          endpoint: `/api/agents/${a.name.replace(/\s+/g,'-').toLowerCase()}/trigger`,
          color: 'bg-indigo-600',
          hover: 'hover:bg-indigo-500',
        }));
        setAgentEndpoints([
          { name: 'Leader Cycle', endpoint: '/api/agents/leader', color: 'bg-cyan-600', hover: 'hover:bg-cyan-500' },
          { name: 'BI Agent', endpoint: '/api/agents/bi', color: 'bg-purple-600', hover: 'hover:bg-purple-500' },
          { name: 'IT Operations Reporter', endpoint: '/api/agents/it-operations-reporter/trigger', color: 'bg-blue-600', hover: 'hover:bg-blue-500' },
          { name: 'Performance Optimizer', endpoint: '/api/agents/performance-optimizer/trigger', color: 'bg-green-600', hover: 'hover:bg-green-500' },
          { name: 'Security Guardian', endpoint: '/api/agents/security-guardian/trigger', color: 'bg-red-600', hover: 'hover:bg-red-500' },
          { name: 'Inventory Forecaster', endpoint: '/api/agents/inventory-forecaster/trigger', color: 'bg-yellow-600', hover: 'hover:bg-yellow-500' },
          { name: 'Sentiment Analyst', endpoint: '/api/agents/sentiment-analyst/trigger', color: 'bg-pink-600', hover: 'hover:bg-pink-500' },
          ...endpoints,
        ]);
      } catch {}
    };
    load();
    const interval = setInterval(load, 30000);
    const listener = () => load();
    window.addEventListener('configUpdated', listener);
    return () => {
      clearInterval(interval);
      window.removeEventListener('configUpdated', listener);
    };
  }, [router]);

  const runAgent = async (endpoint: string, label: string) => {
    setRunning(true);
    setMessage(null);
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error || 'unknown'}`);
      } else {
        setMessage(`${label} finished`);
      }
    } catch (e) {
      setMessage('Network error');
    } finally {
      setRunning(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={() => runAgent('/api/agents/run-enabled', 'Run Enabled Agents')}
        disabled={running}
        className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
      >
        {running ? 'Running…' : 'Run Enabled'}
      </button>
      {agentEndpoints.map(({ name, endpoint, color, hover }) => (
        <button
          key={name}
          onClick={() => runAgent(endpoint, name)}
          disabled={running}
          className={`px-6 py-3 ${color} ${hover} text-black font-semibold rounded-xl transition-colors disabled:opacity-50`}
        >
          {running ? 'Running…' : `Run ${name}`}
        </button>
      ))}
      {message && <p className="text-sm text-slate-400">{message}</p>}
    </div>
  );
}
