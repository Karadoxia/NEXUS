import { prisma } from '@/src/lib/prisma';
import { ScrollText } from 'lucide-react';

const PAGE_SIZE = 50;

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-500/10  text-green-400   border-green-500/20',
  update: 'bg-blue-500/10   text-blue-400    border-blue-500/20',
  delete: 'bg-red-500/10    text-red-400     border-red-500/20',
};

type Props = {
  searchParams: Promise<{ page?: string; entity?: string; admin?: string }>;
};

export default async function AdminLogsPage({ searchParams }: Props) {
  const { page: pageStr, entity, admin } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  const where: Record<string, unknown> = {};
  if (entity) where.entity     = entity;
  if (admin)  where.adminEmail = { contains: admin, mode: 'insensitive' };

  if (!('log' in prisma)) {
    // client was generated before Log model existed
    return (
      <div className="p-8">
        <p className="text-red-400 font-semibold mb-2">Audit table missing.</p>
        <p className="text-sm">
          Run <code className="bg-slate-800 px-1 py-0.5 rounded">npx prisma migrate dev</code> and
          <code className="bg-slate-800 px-1 py-0.5 rounded">npx prisma generate</code>, then restart the
          server.
        </p>
      </div>
    );
  }

  let logs: any[] = [];
  let total = 0;
  try {
    [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.log.count({ where }),
    ]);
  } catch (err: any) {
    console.error('Prisma error fetching logs:', err);
    return (
      <div className="p-8">
        <p className="text-red-400 font-semibold mb-2">Failed to load audit log.</p>
        <p className="text-sm">
          Make sure your database is migrated and the Prisma client is up to date
          (<code className="bg-slate-800 px-1 py-0.5 rounded">npx prisma migrate dev</code>).<br />
          Check the server logs for details.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { entity, admin, page: page.toString(), ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return `/admin/logs${qs ? `?${qs}` : ''}`;
  };

  // Unique entity types for the filter
  const entityTypes = ['product', 'order', 'user'];

  return (
    <div className="p-8 max-w-screen-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ScrollText size={20} className="text-slate-500" />
            Audit Log
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total.toLocaleString()} event{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href={buildHref({ entity: undefined, page: '1' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            !entity
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white'
          }`}
        >
          All
        </a>
        {entityTypes.map((e) => (
          <a
            key={e}
            href={buildHref({ entity: e, page: '1' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              entity === e
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white'
            }`}
          >
            {e.charAt(0).toUpperCase() + e.slice(1)}s
          </a>
        ))}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Time', 'Admin', 'Action', 'Entity', 'ID', 'Detail'].map((h) => (
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
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">
                    No audit events recorded yet
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString('en', {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-xs max-w-[160px] truncate">
                      {l.adminEmail}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase ${ACTION_COLORS[l.action] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs capitalize">{l.entity}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">
                      {l.entityId ? `#${l.entityId.slice(-6).toUpperCase()}` : '—'}
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs max-w-[200px] truncate">
                      {l.detail ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page <span className="text-white font-medium">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={buildHref({ page: (page - 1).toString() })}
                  className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors">
                  ← Prev
                </a>
              )}
              {page < totalPages && (
                <a href={buildHref({ page: (page + 1).toString() })}
                  className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors">
                  Next →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
