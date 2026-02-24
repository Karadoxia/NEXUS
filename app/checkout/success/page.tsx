'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/src/stores/cartStore';
import { useOrderStore } from '@/src/stores/orderStore';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

function SuccessContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const { clearCart, items } = useCartStore();
    const { getOrderByTracking, addOrder, storeOrder } = useOrderStore();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [order, setOrder] = useState<any | null>(null);

    useEffect(() => {
        const id = searchParams.get('orderId');
        const { checkout } = useCartStore.getState();

        async function loadOrderById(orderId: string) {
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                if (res.ok) {
                    const o = await res.json();
                    setOrder(o);
                    addOrder(o);
                    storeOrder(o);
                    return;
                }
                throw new Error(`status ${res.status}`);
            } catch {
                const existing = getOrderByTracking(orderId);
                if (existing) setOrder(existing);
            }
        }

        if (id) {
            setOrderId(id);
            loadOrderById(id);
            clearCart();
            return;
        }

        if (items.length > 0) {
            (async () => {
                try {
                    const newOrder = await checkout({ name: 'Guest User', email: 'guest@example.com' });
                    setOrderId(newOrder.id);
                    setOrder(newOrder);
                    addOrder(newOrder);
                    storeOrder(newOrder);
                } catch (e) {
                    console.error('failed to create order on success page', e);
                    const fallback: any = {
                        id: `local-${Date.now()}`,
                        items,
                        total: items.reduce((s, i) => s + i.price * i.quantity, 0),
                        status: 'pending',
                        date: new Date().toISOString(),
                        customer: { name: 'Guest User', email: 'guest@example.com' },
                    };
                    setOrderId(fallback.id);
                    setOrder(fallback);
                    storeOrder(fallback);
                }
            })();
        }
    }, [searchParams, clearCart, getOrderByTracking, items, addOrder]);

    if (!orderId && items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <p>Redirecting...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />
            <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400">
                    ORDER CONFIRMED!
                </h1>
                <p className="text-xl text-slate-400 max-w-md mb-8">
                    Thank you for your purchase. Your order <span className="text-cyan-400 font-mono font-bold">#{orderId}</span> has been received.
                </p>
                {!session?.user && (
                  <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700 text-center mb-8">
                    <p className="text-slate-300 mb-2">Create an account to view orders anytime and checkout faster.</p>
                    <Link href="/signin" className="text-cyan-400 underline font-bold">Sign in / Sign up</Link>
                  </div>
                )
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-md w-full mb-12">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                        <span className="text-slate-400">Order ID:</span>
                        <span className="font-mono text-white">{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                        <span className="text-slate-400">Estimated Delivery:</span>
                        <span className="text-white">3-5 Business Days</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total:</span>
                        <span className="text-xl font-bold text-cyan-400">€{order ? order.total.toLocaleString() : '0.00'}</span>
                    </div>
                    <div className="mt-6 text-sm text-slate-500">
                        A confirmation email has been sent to your inbox.
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/account">
                        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all">
                            VIEW ORDER
                        </button>
                    </Link>
                    <Link href="/store">
                        <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all">
                            CONTINUE SHOPPING <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Order...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
