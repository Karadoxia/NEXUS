import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';
import { redirect } from 'next/navigation';

const ROLE_COLORS: Record<string, string> = {
  admin:   'bg-cyan-500/10   text-cyan-400   border-cyan-500/20',
  editor:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  support: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
  user:    'bg-slate-800     text-slate-500  border-slate-700',
};

const PAGE_SIZE = 50;

type Props = {
  searchParams: Promise<{ q?: string; page?: string; role?: string }>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(session.user as { isAdmin?: boolean }).isAdmin) {
    redirect('/signin');
  }

  const { q, page: pageStr, role } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (q) {
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { name:  { contains: q, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q, role, page: page.toString(), ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return `/admin/users${qs ? `?${qs}` : ''}`;
  };

  const roles = ['', 'admin', 'editor', 'support', 'user'];

  return (
    <div className="p-8 max-w-screen-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total.toLocaleString()} registered user{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search + role filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form method="get" action="/admin/users" className="flex gap-2">
          {role && <input type="hidden" name="role" value={role} />}
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search email or name…"
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm w-64 focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
          {(q || role) && (
            <a
              href="/admin/users"
              className="px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-xl hover:border-slate-500 hover:text-white transition-colors"
            >
              Clear
            </a>
          )}
        </form>

        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {roles.map((r) => (
            <a
              key={r}
              href={buildHref({ role: r || undefined, page: '1' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                (role ?? '') === r
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white'
              }`}
            >
              {r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All'}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Email', 'Name', 'Phone', 'Role', 'Joined'].map((h) => (
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-slate-500">
                    No users match this filter
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 text-slate-300 break-all">{u.email}</td>
                    <td className="px-5 py-3 text-slate-400">{u.name ?? <span className="text-slate-600">—</span>}</td>
                    <td className="px-5 py-3 text-slate-400">{u.phone ?? <span className="text-slate-600">—</span>}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase ${ROLE_COLORS[u.role] ?? ROLE_COLORS.user}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString('en', {
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
