'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Cpu,
  LogOut,
  Zap,
  Mail,
  Bot,
  ScrollText,
  Wrench,
  Users2,
  Container,
  Workflow,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useOrderStore } from '@/src/stores/orderStore';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, badge: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/users', label: 'Clients', icon: Users },
  { href: '/admin/team', label: 'Team', icon: Users2 },
  { href: '/admin/employees', label: 'Employees', icon: Users2 },
  { href: '/admin/containers', label: 'Containers', icon: Container },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/performance', label: 'Performance', icon: TrendingUp },
  { href: '/admin/workflows', label: 'Workflows', icon: Workflow },
  { href: '/admin/agents', label: 'Agent Cycles', icon: Bot },
  { href: '/admin/config', label: 'Agent Config', icon: Cpu },
  { href: '/admin/logs', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/tools', label: 'Tools', icon: Wrench },
] as const;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [pendingOrders, setPendingOrders] = useState(0);

  // Poll for pending order count every 30 s
  useEffect(() => {
    let active = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) return;
        const data = await res.json();
        if (active) setPendingOrders(data.pending ?? 0);
      } catch { /* swallow network errors */ }
    };
    fetchStats();
    const id = setInterval(fetchStats, 30_000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-60 bg-[#060d1a] border-r border-slate-800/80 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap size={15} className="text-black" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-wide">NEXUS</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Main Menu
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon, ...rest }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          const showBadge = 'badge' in rest && rest.badge && pendingOrders > 0;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              {label}
              <span className="ml-auto flex items-center gap-1">
                {showBadge && (
                  <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-amber-500 text-black rounded-full px-1">
                    {pendingOrders > 99 ? '99+' : pendingOrders}
                  </span>
                )}
                {active && !showBadge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/60" />
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800/80 space-y-1">
        <div className="px-3 py-2 rounded-xl bg-slate-900/50 mb-2">
          <p className="text-xs text-slate-300 font-medium truncate">{userEmail}</p>
          <p className="text-[10px] text-cyan-500 font-semibold uppercase tracking-widest mt-0.5">
            Administrator
          </p>
        </div>
        <button
          type="button"
          onClick={() => { useOrderStore.setState({ orders: [] }); signOut({ callbackUrl: '/' }); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
