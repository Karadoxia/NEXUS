'use client';

import { useEffect, useState } from 'react';
import {
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Download,
  Terminal,
  Play,
  Square,
  RefreshCcw,
} from 'lucide-react';

interface RegistrationStatus {
  traefik: { registered: boolean; updatedAt: string | null };
  prometheus: {
    registered: boolean;
    updatedAt: string | null;
    jobName: string | null;
  };
  grafana: { registered: boolean; updatedAt: string | null; panelCount: number };
  kuma: { registered: boolean; updatedAt: string | null; monitorId: number | null };
  wireguard: {
    registered: boolean;
    updatedAt: string | null;
    assignedIp: string | null;
  };
  loki: { registered: boolean; updatedAt: string | null };
}

interface Container {
  id: string;
  containerId: string;
  containerName: string;
  image: string | null;
  status: string;
}

interface ContainerStatus {
  container: Container;
  registration: RegistrationStatus;
  summary: {
    registeredSystems: number;
    totalSystems: number;
    completionPercentage: number;
    allRegistered: boolean;
    firstDetected: string;
    lastEvent: string;
    completedAt: string | null;
  };
  recentEvents: any[];
}

function ContainerStats({ containerId, status }: { containerId: string, status: string }) {
  const [stats, setStats] = useState<{ cpuPercent: number, memoryPercent: number, memoryUsageBytes: number } | null>(null);

  useEffect(() => {
    if (status !== 'active') {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/docker/containers/${containerId}/stats`);
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (e) {
        // ignore
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [containerId, status]);

  if (status !== 'active') return <span className="text-xs text-slate-500">Offline</span>;
  if (!stats) return <span className="text-xs text-slate-500 flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> Loading...</span>;

  return (
    <div className="flex flex-col gap-1 w-32">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>CPU</span>
        <span>{stats.cpuPercent}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, stats.cpuPercent)}%` }}></div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
        <span>RAM</span>
        <span>{stats.memoryPercent}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, stats.memoryPercent)}%` }}></div>
      </div>
    </div>
  );
}

export default function ContainersPage() {
  const [containers, setContainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContainer, setSelectedContainer] = useState<ContainerStatus | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/docker/register');
      if (!res.ok) throw new Error('Failed to fetch containers');
      const data = await res.json();
      setContainers(data.containers || []);
    } catch (err) {
      console.error('Failed to fetch containers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContainerStatus = async (containerId: string) => {
    try {
      const res = await fetch(`/api/docker/containers/${containerId}/status`);
      if (!res.ok) throw new Error('Failed to fetch status');
      const data = await res.json();
      setSelectedContainer(data);
    } catch (err) {
      console.error('Failed to fetch container status:', err);
    }
  };

  const handleRetry = async (containerId: string, systems?: string[]) => {
    try {
      setRetryingId(containerId);
      const res = await fetch(`/api/docker/containers/${containerId}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systems: systems || undefined }),
      });

      if (!res.ok) throw new Error('Retry failed');
      await fetchContainerStatus(containerId);
      await fetchContainers();
    } catch (err) {
      console.error('Retry failed:', err);
      alert('Failed to retry registration');
    } finally {
      setRetryingId(null);
    }
  };

  const handleSyncDocker = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/docker/sync', { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      const data = await res.json();
      alert(`Sync Complete: Scanned ${data.scanned} containers. Imported ${data.synced} new containers.`);
      await fetchContainers();
    } catch (err) {
      console.error('Docker Sync failed:', err);
      alert('Failed to synchronize with local Docker daemon.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleContainerAction = async (containerId: string, action: 'start' | 'stop' | 'restart', e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setActioningId(containerId + action);
      const res = await fetch(`/api/docker/containers/${containerId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || 'Action failed');
      }
      await fetchContainers(); // Refresh list to get new status
    } catch (err: any) {
      console.error(`${action} failed:`, err);
      alert(`Failed to ${action} container: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleConsole = (containerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // For a real terminal, this would open a WebSocket to a backend proxy.
    // For now, we provide the CLI command to the user.
    alert(`Console Access\n\nRun this command in your terminal to attach:\n\ndocker exec -it ${containerName} /bin/sh`);
  };

  const getStatusColor = (registered: boolean) => {
    return registered ? 'text-green-400' : 'text-red-400';
  };

  const getSystemIcon = (registered: boolean) => {
    return registered ? (
      <CheckCircle size={16} className="text-green-400" />
    ) : (
      <AlertCircle size={16} className="text-red-400" />
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Container Registry</h1>
          <p className="text-slate-400 mt-1">
            Monitor and manage automatic container registration across infrastructure
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchContainers}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button
            onClick={handleSyncDocker}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
          >
            <Download size={20} />
            {isSyncing ? 'Syncing...' : 'Sync Local Docker'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Total Containers</p>
          <p className="text-2xl font-bold text-white mt-2">{containers.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-2">
            {containers.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Fully Registered</p>
          <p className="text-2xl font-bold text-cyan-400 mt-2">
            {containers.filter((c) => {
              const registered = [
                c.traefikRegistered,
                c.prometheusRegistered,
                c.grafanaRegistered,
                c.kumaRegistered,
                c.wireguardRegistered,
                c.lokiRegistered,
              ].filter(Boolean).length;
              return registered === 6;
            }).length}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Pending Registration</p>
          <p className="text-2xl font-bold text-yellow-400 mt-2">
            {containers.filter((c) => {
              const registered = [
                c.traefikRegistered,
                c.prometheusRegistered,
                c.grafanaRegistered,
                c.kumaRegistered,
                c.wireguardRegistered,
                c.lokiRegistered,
              ].filter(Boolean).length;
              return registered > 0 && registered < 6;
            }).length}
          </p>
        </div>
      </div>

      {/* Containers Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading containers...</div>
        ) : containers.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No containers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">
                    Container
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-400">
                    Registration Progress
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {containers.map((container) => {
                  const registered = [
                    container.traefikRegistered,
                    container.prometheusRegistered,
                    container.grafanaRegistered,
                    container.kumaRegistered,
                    container.wireguardRegistered,
                    container.lokiRegistered,
                  ].filter(Boolean).length;
                  const totalSystems = 6;
                  const percentage = Math.round((registered / totalSystems) * 100);
                  const isComplete = registered === totalSystems;

                  return (
                    <tr
                      key={container.id}
                      className="hover:bg-slate-800/30 transition cursor-pointer"
                      onClick={() => fetchContainerStatus(container.containerId)}
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        <div>
                          <p>{container.containerName}</p>
                          <p className="text-xs text-slate-500">
                            {container.containerId.slice(0, 12)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {container.image ? (
                          <span className="text-xs bg-slate-800 px-2 py-1 rounded">
                            {container.image.split(':')[0].split('/').pop()}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${container.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                          {container.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ContainerStats containerId={container.containerId} status={container.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-800 rounded-full h-2">
                            <div
                              className={`h-full rounded-full transition-all ${isComplete
                                ? 'bg-green-500'
                                : percentage > 50
                                  ? 'bg-cyan-500'
                                  : percentage > 0
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">
                            {registered}/{totalSystems}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleContainerAction(container.containerId, 'start', e)}
                            disabled={actioningId === container.containerId + 'start' || container.status === 'active'}
                            title="Start"
                            className="p-1.5 bg-slate-800 hover:bg-green-600/20 text-green-500 disabled:opacity-30 disabled:hover:bg-slate-800 rounded transition"
                          >
                            <Play size={16} />
                          </button>
                          <button
                            onClick={(e) => handleContainerAction(container.containerId, 'restart', e)}
                            disabled={actioningId === container.containerId + 'restart'}
                            title="Restart"
                            className="p-1.5 bg-slate-800 hover:bg-yellow-600/20 text-yellow-500 disabled:opacity-30 disabled:hover:bg-slate-800 rounded transition"
                          >
                            <RefreshCcw size={16} />
                          </button>
                          <button
                            onClick={(e) => handleContainerAction(container.containerId, 'stop', e)}
                            disabled={actioningId === container.containerId + 'stop' || container.status !== 'active'}
                            title="Stop"
                            className="p-1.5 bg-slate-800 hover:bg-red-600/20 text-red-500 disabled:opacity-30 disabled:hover:bg-slate-800 rounded transition"
                          >
                            <Square size={16} />
                          </button>
                          <div className="w-px h-5 bg-slate-700 mx-1"></div>
                          <button
                            onClick={(e) => handleConsole(container.containerName, e)}
                            title="Console"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                          >
                            <Terminal size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchContainerStatus(container.containerId);
                            }}
                            className="ml-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded transition"
                          >
                            Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedContainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedContainer.container.containerName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedContainer.container.containerId}
                </p>
              </div>
              <button
                onClick={() => setSelectedContainer(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Completion</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {selectedContainer.summary.completionPercentage}%
                  </p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div
                      className={`h-full rounded-full transition-all ${selectedContainer.summary.allRegistered
                        ? 'bg-green-500'
                        : 'bg-cyan-500'
                        }`}
                      style={{
                        width: `${selectedContainer.summary.completionPercentage}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {selectedContainer.summary.registeredSystems}/
                    {selectedContainer.summary.totalSystems} systems registered
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">First Detected</p>
                  <p className="text-white mt-1">
                    {new Date(selectedContainer.summary.firstDetected).toLocaleDateString()}
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    {new Date(selectedContainer.summary.firstDetected).toLocaleTimeString()}
                  </p>
                  {selectedContainer.summary.completedAt && (
                    <p className="text-green-400 text-xs mt-4">
                      ✓ Fully registered{' '}
                      {new Date(selectedContainer.summary.completedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Status by System */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Registration Status</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Traefik */}
                <div className="border border-slate-700 rounded-lg p-3 flex items-start gap-3">
                  <div className="mt-1">
                    {getSystemIcon(selectedContainer.registration.traefik.registered)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Traefik</p>
                    <p className={`text-xs ${getStatusColor(selectedContainer.registration.traefik.registered)}`}>
                      {selectedContainer.registration.traefik.registered
                        ? 'Registered'
                        : 'Pending'}
                    </p>
                    {selectedContainer.registration.traefik.updatedAt && (
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(selectedContainer.registration.traefik.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Prometheus */}
                <div className="border border-slate-700 rounded-lg p-3 flex items-start gap-3">
                  <div className="mt-1">
                    {getSystemIcon(selectedContainer.registration.prometheus.registered)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Prometheus</p>
                    <p className={`text-xs ${getStatusColor(selectedContainer.registration.prometheus.registered)}`}>
                      {selectedContainer.registration.prometheus.registered
                        ? 'Registered'
                        : 'Pending'}
                    </p>
                    {selectedContainer.registration.prometheus.jobName && (
                      <p className="text-xs text-slate-400 mt-1">
                        Job: {selectedContainer.registration.prometheus.jobName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grafana */}
                <div className="border border-slate-700 rounded-lg p-3 flex items-start gap-3">
                  <div className="mt-1">
                    {getSystemIcon(selectedContainer.registration.grafana.registered)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Grafana</p>
                    <p className={`text-xs ${getStatusColor(selectedContainer.registration.grafana.registered)}`}>
                      {selectedContainer.registration.grafana.registered
                        ? 'Registered'
                        : 'Pending'}
                    </p>
                    {selectedContainer.registration.grafana.panelCount > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        {selectedContainer.registration.grafana.panelCount} panels
                      </p>
                    )}
                  </div>
                </div>

                {/* Kuma */}
                <div className="border border-slate-700 rounded-lg p-3 flex items-start gap-3">
                  <div className="mt-1">
                    {getSystemIcon(selectedContainer.registration.kuma.registered)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Uptime Kuma</p>
                    <p className={`text-xs ${getStatusColor(selectedContainer.registration.kuma.registered)}`}>
                      {selectedContainer.registration.kuma.registered
                        ? 'Registered'
                        : 'Pending'}
                    </p>
                    {selectedContainer.registration.kuma.monitorId && (
                      <p className="text-xs text-slate-400 mt-1">
                        Monitor ID: {selectedContainer.registration.kuma.monitorId}
                      </p>
                    )}
                  </div>
                </div>

                {/* WireGuard */}
                <div className="border border-slate-700 rounded-lg p-3 flex items-start gap-3">
                  <div className="mt-1">
                    {getSystemIcon(selectedContainer.registration.wireguard.registered)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">WireGuard</p>
                    <p className={`text-xs ${getStatusColor(selectedContainer.registration.wireguard.registered)}`}>
                      {selectedContainer.registration.wireguard.registered
                        ? 'Registered'
                        : 'Pending'}
                    </p>
                    {selectedContainer.registration.wireguard.assignedIp && (
                      <p className="text-xs text-slate-400 mt-1">
                        IP: {selectedContainer.registration.wireguard.assignedIp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Loki */}
                <div className="border border-slate-700 rounded-lg p-3 flex items-start gap-3">
                  <div className="mt-1">
                    {getSystemIcon(selectedContainer.registration.loki.registered)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Loki</p>
                    <p className={`text-xs ${getStatusColor(selectedContainer.registration.loki.registered)}`}>
                      {selectedContainer.registration.loki.registered ? 'Registered' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Events */}
            {selectedContainer.recentEvents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Events</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedContainer.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-slate-700 rounded p-2 text-xs flex items-start gap-2"
                    >
                      <Clock size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-slate-300">
                          <span className="font-medium">{event.system}</span> -{' '}
                          {event.message}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button
                onClick={() => setSelectedContainer(null)}
                className="flex-1 px-4 py-2 border border-slate-700 text-white rounded hover:bg-slate-800 transition"
              >
                Close
              </button>
              {!selectedContainer.summary.allRegistered && (
                <button
                  onClick={() => handleRetry(selectedContainer.container.containerId)}
                  disabled={retryingId === selectedContainer.container.containerId}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white rounded flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw size={16} />
                  {retryingId === selectedContainer.container.containerId
                    ? 'Retrying...'
                    : 'Retry All'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
