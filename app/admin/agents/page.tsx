import { prisma } from '@/src/lib/prisma';
import { Activity, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

const PAGE_SIZE = 30;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminAgentsPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  const [entries, total] = await Promise.all([
    prisma.performance.findMany({
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.performance.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Aggregate totals from all records for the summary cards
  const agg = await prisma.performance.aggregate({
    _sum: { orders: true, returns: true },
    _count: { downtime: true },
  });
  const downtimeCount = await prisma.performance.count({ where: { downtime: true } });
  const totalOrders  = agg._sum.orders  ?? 0;
  const totalReturns = agg._sum.returns ?? 0;
  const returnRate   = totalOrders > 0 ? ((totalReturns / totalOrders) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-8 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Agent Performance</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {total.toLocaleString()} cycle{total !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders',  value: totalOrders.toLocaleString(),  icon: TrendingUp,   ring: 'bg-cyan-400/10 border-cyan-400/20 text-cyan-400' },
          { label: 'Total Returns', value: totalReturns.toLocaleString(), icon: TrendingDown, ring: 'bg-red-400/10 border-red-400/20 text-red-400' },
          { label: 'Return Rate',   value: `${returnRate}%`,              icon: Activity,     ring: 'bg-amber-400/10 border-amber-400/20 text-amber-400' },
          { label: 'Downtime Events', value: downtimeCount.toString(),    icon: AlertTriangle, ring: 'bg-red-400/10 border-red-400/20 text-red-400' },
        ].map(({ label, value, icon: Icon, ring }) => (
          <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
              <span className={`p-1.5 rounded-lg border ${ring}`}>
                <Icon size={14} strokeWidth={2} />
              </span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* History table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Timestamp', 'Orders', 'Returns', 'Return %', 'Downtime', 'Notes'].map((h) => (
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
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">
                    No performance data yet — start the agent scheduler to populate this
                  </td>
                </tr>
              ) : (
                entries.map((e) => {
                  const rate = e.orders > 0 ? ((e.returns / e.orders) * 100).toFixed(1) : '—';
                  return (
                    <tr key={e.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {new Date(e.timestamp).toLocaleString('en', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3 text-white font-semibold tabular-nums">{e.orders}</td>
                      <td className="px-5 py-3 text-slate-300 tabular-nums">{e.returns}</td>
                      <td className="px-5 py-3 tabular-nums">
                        <span className={parseFloat(rate) > 10 ? 'text-red-400' : 'text-slate-400'}>
                          {typeof rate === 'string' && rate !== '—' ? `${rate}%` : rate}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {e.downtime ? (
                          <span className="text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded">
                            YES
                          </span>
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

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page <span className="text-white font-medium">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/admin/agents?page=${page - 1}`}
                  className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                >
                  ← Prev
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/admin/agents?page=${page + 1}`}
                  className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                >
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
