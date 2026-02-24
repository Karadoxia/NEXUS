'use client';

import { Home, Grid, Cpu, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/src/stores/cartStore';

export function MobileNav() {
    const pathname = usePathname();
    const cartCount = useCartStore((s) => s.items.length);

    const links = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/store', icon: Grid, label: 'Shop' },
        { href: '/builder', icon: Cpu, label: 'Build' },
        { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
        { href: '/account', icon: User, label: 'Profile' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
            <nav className="pointer-events-auto bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-between items-center px-6 py-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {links.map(({ href, icon: Icon, label, badge }) => {
                    const isActive = pathname === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`relative flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#00D4FF]' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#00D4FF]/10' : ''}`}>
                                <Icon className="h-5 w-5" suppressHydrationWarning />
                            </div>
                            <span className="text-[10px] font-medium">{label}</span>

                            {/* Notification Badge */}
                            {badge !== undefined && badge > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2D78] text-[10px] font-bold text-white mb-2">
                                    {badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
