import { prisma } from '@/src/lib/prisma';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Activity,
  Mail,
  TrendingUp,
} from 'lucide-react';
import AdminRevenueChart from './_components/revenue-chart';
import ProgressBar from './_components/progress-bar';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-500/10  text-amber-400   border-amber-500/20',
  processing: 'bg-blue-500/10   text-blue-400    border-blue-500/20',
  shipped:    'bg-purple-500/10 text-purple-400  border-purple-500/20',
  delivered:  'bg-green-500/10  text-green-400   border-green-500/20',
  cancelled:  'bg-red-500/10    text-red-400     border-red-500/20',
};

export default async function AdminDashboard() {
  const now         = new Date();
  const startToday  = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start7      = new Date(startToday);
  start7.setDate(start7.getDate() - 6);

  const [
    revenueAgg,
    revenueTodayAgg,
    ordersToday,
    ordersActive,
    customers,
    productCount,
    lowStock,
    subscribers,
    recentOrders,
    ordersLast7,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.aggregate({ where: { date: { gte: startToday } }, _sum: { total: true } }),
    prisma.order.count({ where: { date: { gte: startToday } } }),
    prisma.order.count({ where: { status: { in: ['pending', 'processing', 'shipped'] } } }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 10 } } }),
    prisma.subscriber.count(),
    prisma.order.findMany({
      take: 8,
      orderBy: { date: 'desc' },
      include: { user: { select: { email: true } } },
    }),
    prisma.order.findMany({
      where: { date: { gte: start7 } },
      select: { date: true, total: true },
      orderBy: { date: 'asc' },
    }),
  ]);

  // Build daily buckets for the chart (oldest → newest)
  const salesByDay = Array.from({ length: 7 }, (_, i) => {
    const d    = new Date(startToday);
    d.setDate(d.getDate() - (6 - i));
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    return {
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      revenue: ordersLast7
        .filter((o) => o.date >= d && o.date < next)
        .reduce((s, o) => s + o.total, 0),
    };
  });

  const revenue      = revenueAgg._sum.total ?? 0;
  const revenueToday = revenueTodayAgg._sum.total ?? 0;
  const fulfillPct   = productCount > 0 ? Math.min(Math.round((lowStock / productCount) * 100), 100) : 0;

  const kpis = [
    {
      label: 'Total Revenue',
      value: `€${revenue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `€${revenueToday.toFixed(2)} today`,
      icon: DollarSign,
      ring: 'bg-green-400/10  border-green-400/20  text-green-400',
    },
    {
      label: 'Active Orders',
      value: ordersActive.toString(),
      sub: `${ordersToday} new today`,
      icon: ShoppingCart,
      ring: 'bg-cyan-400/10   border-cyan-400/20   text-cyan-400',
    },
    {
      label: 'Products',
      value: productCount.toString(),
      sub: `${lowStock} low on stock`,
      icon: Package,
      ring: 'bg-purple-400/10 border-purple-400/20 text-purple-400',
    },
    {
      label: 'Customers',
      value: customers.toString(),
      sub: `${subscribers} newsletter subs`,
      icon: Users,
      ring: 'bg-blue-400/10   border-blue-400/20   text-blue-400',
    },
  ];

  return (
    <div className="p-8 max-w-screen-xl">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {now.toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, sub, icon: Icon, ring }) => (
          <div
            key={label}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
              <span className={`p-1.5 rounded-lg border ${ring}`}>
                <Icon size={14} strokeWidth={2} />
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 tabular-nums">{value}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Revenue Area Chart */}
        <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-white">Revenue Trend</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 7 days</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
              <Activity size={11} strokeWidth={2.5} />
              Live
            </span>
          </div>
          <AdminRevenueChart data={salesByDay} />
        </div>

        {/* Store Health */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Store Health</h2>
            <TrendingUp size={14} className="text-slate-500" />
          </div>

          <div className="space-y-5">
            {[
              { label: 'Active Orders',     value: ordersActive,    total: Math.max(ordersActive + ordersToday, 1), color: 'bg-cyan-500'   },
              { label: 'Low Stock %',       value: lowStock,        total: Math.max(productCount, 1),               color: 'bg-amber-500'  },
              { label: 'Newsletter Subs',   value: subscribers,     total: Math.max(subscribers, 1),                color: 'bg-green-500'  },
              { label: 'Customers',         value: customers,       total: Math.max(customers, 1),                  color: 'bg-blue-500'   },
            ].map(({ label, value, total, color }) => {
              const pct = Math.round((value / total) * 100);
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-semibold tabular-nums">{value.toLocaleString()}</span>
                  </div>
                  <ProgressBar pct={pct} color={color} />
                </div>
              );
            })}
          </div>

          {lowStock > 0 && (
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300 leading-relaxed">
                <span className="font-semibold">{lowStock}</span> product{lowStock !== 1 ? 's' : ''} running low on stock
              </p>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 p-3 bg-slate-800/40 rounded-xl">
            <Mail size={13} className="text-slate-500 shrink-0" />
            <p className="text-xs text-slate-400">
              <span className="text-white font-semibold">{subscribers}</span> newsletter subscribers
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View all →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-12">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-900/40">
                  {['Order', 'Customer', 'Total', 'Date', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-3 font-mono text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                      #{o.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-slate-300 text-sm">{o.user?.email ?? 'Guest'}</td>
                    <td className="px-6 py-3 font-semibold text-white tabular-nums">
                      €{o.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs">
                      {new Date(o.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase ${STATUS_COLORS[o.status] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
