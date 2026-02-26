import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import OrderStatusSelect from '../_components/order-status-select';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-500/10  text-amber-400   border-amber-500/20',
  processing: 'bg-blue-500/10   text-blue-400    border-blue-500/20',
  shipped:    'bg-purple-500/10 text-purple-400  border-purple-500/20',
  delivered:  'bg-green-500/10  text-green-400   border-green-500/20',
  cancelled:  'bg-red-500/10    text-red-400     border-red-500/20',
};

const STATUSES = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(session.user as { isAdmin?: boolean }).isAdmin) {
    redirect('/signin');
  }

  const { status, q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  const where: Parameters<typeof prisma.order.findMany>[0]['where'] = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { id: { contains: q } },
      { user: { email: { contains: q } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user:  { select: { email: true } },
        items: { select: { quantity: true } },
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status, q, page: page.toString(), ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return `/admin/orders${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="p-8 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total.toLocaleString()} order{total !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <a
            key={s}
            href={buildHref({ status: s || undefined, page: '1' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              (status ?? '') === s
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Order', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Action'].map((h) => (
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-slate-500 text-sm">
                    No orders match this filter
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500 group-hover:text-slate-400">
                      #{o.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-sm max-w-[180px] truncate">
                      {o.user?.email ?? <span className="text-slate-600">Guest</span>}
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-sm tabular-nums">
                      {o.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-3 font-semibold text-white tabular-nums">
                      €{o.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(o.date).toLocaleDateString('en', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase ${STATUS_COLORS[o.status] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page <span className="text-white font-medium">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={buildHref({ page: (page - 1).toString() })}
                  className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                >
                  ← Prev
                </a>
              )}
              {page < totalPages && (
                <a
                  href={buildHref({ page: (page + 1).toString() })}
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
