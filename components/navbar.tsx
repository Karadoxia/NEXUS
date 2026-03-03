'use client';

import { ShoppingCart, Search, Menu, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useCartStore } from '@/src/stores/cartStore';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { useState, useEffect } from 'react';
import { SearchModal } from './search-modal';
import { useSession, signOut } from 'next-auth/react';
import { useOrderStore } from '@/src/stores/orderStore';


export function Navbar() {
  const { count, openCart } = useCartStore();
  const { items: favItems } = useFavoritesStore();
  const cartCount = count();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut to open search
  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* auth logic is client-only so we lazily load composed component below */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
              N
            </div>
            <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-cyan-400 transition-colors">
              NEXUS
            </Link>
            <Link href="/store" className="ml-8 text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">
              STORE
            </Link>
            <Link href="/builder" className="ml-6 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors hidden md:block flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              SYSTEM CONFIG
            </Link>
            {mounted && session?.user && (
              <Link href="/profile" className="ml-6 text-sm font-medium text-white hover:text-cyan-200 hidden md:block">
                PROFILE
              </Link>
            )}
            {mounted && (session?.user as { isAdmin?: boolean })?.isAdmin && (
              <Link href="/admin/orders" className="ml-6 text-sm font-medium text-red-400 hover:text-red-300 hidden md:block">
                ADMIN
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 gap-2 px-3"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" suppressHydrationWarning />
              <span className="hidden md:inline-block text-xs text-cyan-500/50 font-mono border border-cyan-900/30 rounded px-1.5 py-0.5">
                ⌘K
              </span>
            </Button>
            <Link href="/favorites">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 relative">
                <Heart className={`h-5 w-5 ${favItems.length > 0 ? 'fill-red-500 text-red-500' : ''}`} suppressHydrationWarning />
                {favItems.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/10 relative"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" suppressHydrationWarning />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* authentication */}
            {mounted && (
              <AuthButtons />
            )}

            <Button variant="ghost" className="md:hidden text-slate-300">
              <Menu className="h-6 w-6" suppressHydrationWarning />
            </Button>
          </div>
        </div>
      </nav>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function AuthButtons() {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  if (session?.user) {
    const displayName = session.user.name
      ? `Hi, ${session.user.name.split(' ')[0]}`
      : session.user.email;
    return (
      <div className="flex items-center gap-2">
        <Link href="/profile" className="text-sm text-cyan-300 hover:text-cyan-200 font-medium hidden md:block">
          {displayName}
        </Link>
        <button
          onClick={async () => {
            useOrderStore.setState({ orders: [] });
            await signOut({ redirect: false });
            window.location.href = '/';
          }}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 py-1 px-3 rounded text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <Link href="/signin">
      <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 hidden md:inline-flex">
        Sign In
      </Button>
    </Link>
  );
}
