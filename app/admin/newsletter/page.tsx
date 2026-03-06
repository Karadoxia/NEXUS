import { prisma } from '@/src/lib/prisma';
import { Mail, Download } from 'lucide-react';

const PAGE_SIZE = 50;

type Props = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function AdminNewsletterPage({ searchParams }: Props) {
  const { page: pageStr, q } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  const where = q
    ? { email: { contains: q, mode: 'insensitive' as const } }
    : {};

  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      orderBy: { joinedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.subscriber.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q, page: page.toString(), ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return `/admin/newsletter${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="p-8 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total.toLocaleString()} subscriber{total !== 1 ? 's' : ''}
          </p>
        </div>
        <a
          href={`/api/admin/subscribers/export`}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <Download size={14} />
          Export CSV
        </a>
      </div>

      {/* Search */}
      <form method="get" action="/admin/newsletter" className="mb-6">
        <div className="flex gap-3 max-w-md">
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search by email…"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
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
              href="/admin/newsletter"
              className="px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-xl hover:border-slate-500 hover:text-white transition-colors"
            >
              Clear
            </a>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Email', 'Joined'].map((h) => (
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
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-5 py-14 text-center text-slate-500">
                    {q ? 'No subscribers match this search' : 'No subscribers yet'}
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 text-slate-300">{s.email}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(s.joinedAt).toLocaleDateString('en', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
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
