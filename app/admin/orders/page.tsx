import { prisma } from '@/src/lib/prisma';
import type { Prisma } from '@/src/generated/prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';
import OrdersTableClient from '../_components/orders-table-client';

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

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { id: { contains: q, mode: 'insensitive' } },
      { user: { email: { contains: q, mode: 'insensitive' } } },
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

      {/* Search + status filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search box */}
        <form method="get" action="/admin/orders" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search order ID or email…"
              className="bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm w-72 focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
          {q && (
            <a
              href={buildHref({ q: undefined, page: '1' })}
              className="px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-xl hover:border-slate-500 hover:text-white transition-colors"
            >
              Clear
            </a>
          )}
        </form>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2 sm:ml-auto">
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
            <OrdersTableClient orders={orders.map((o) => ({ ...o, date: o.date.toISOString() }))} />
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
