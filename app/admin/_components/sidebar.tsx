'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/admin',             label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/orders',      label: 'Orders',       icon: ShoppingCart    },
  { href: '/admin/products',    label: 'Products',     icon: Package         },
  { href: '/admin/users',       label: 'Clients',      icon: Users           },
  { href: '/admin/performance', label: 'Performance',  icon: TrendingUp      },
  { href: '/admin/config',      label: 'Agent Config', icon: Cpu             },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#060d1a] border-r border-slate-800/80 flex flex-col z-40">
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
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
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
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/60" />
              )}
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
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
