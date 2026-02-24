'use client';

import { useState, useEffect } from 'react';
import { useOrderStore } from '@/src/stores/orderStore';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, CheckCircle, Truck, ChevronRight } from 'lucide-react';

export default function AccountPage() {
    // In a real app, we would filter by the logged-in user's email
    // For this mock, we'll just show all orders for "guest@example.com" or all orders in local storage
    const { orders } = useOrderStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!isMounted) return null;

    // Mock user for display
    const user = {
        name: 'Guest User',
        email: 'guest@example.com',
        avatar: '👤'
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-amber-400" />;
            case 'processing': return <Package size={16} className="text-blue-400" />;
            case 'shipped': return <Truck size={16} className="text-purple-400" />;
            case 'delivered': return <CheckCircle size={16} className="text-green-400" />;
            default: return <Clock size={16} className="text-gray-400" />;
        }
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-20 w-20 bg-cyan-900/30 rounded-full flex items-center justify-center text-4xl border border-cyan-500/30">
                            {user.avatar}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            <p className="text-slate-400">{user.email}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-slate-300 border border-white/10">
                                MOCK ACCOUNT
                            </span>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Order History</h2>
                            <span className="text-sm text-slate-500">{orders.length} orders</span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                <Package size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="mb-6">You haven&apos;t placed any orders yet.</p>
                                <Link href="/store">
                                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                        START SHOPPING
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {orders.map((order) => (
                                    <div key={order.id} className="p-6 hover:bg-white/5 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-mono font-bold text-cyan-400">{order.id}</span>
                                                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                        <StatusIcon status={order.status} />
                                                        {order.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    Placed on {new Date(order.date).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Preview Images */}
                                            <div className="flex -space-x-3">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden relative flex items-center justify-center text-xs text-slate-600">
                                                        {item.images?.[0] ? (
                                                            <Image src={item.images[0]} alt="" fill className="object-cover" />
                                                        ) : (
                                                            <span>?</span>
                                                        )}
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Total & Action */}
                                            <div className="text-right min-w-[120px]">
                                                <div className="font-bold text-white mb-1">€{order.total.toLocaleString()}</div>
                                                <button className="text-xs text-cyan-400 flex items-center gap-1 ml-auto group-hover:underline">
                                                    Details <ChevronRight size={12} />
                                                </button>
                                                {order.trackingNumber && (
                                                    <Link href={`/tracking?id=${order.trackingNumber}`}>
                                                        <button className="mt-2 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded flex items-center gap-1 ml-auto hover:bg-cyan-500/20">
                                                            <Truck size={10} /> TRACK PACKAGE
                                                        </button>
                                                    </Link>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
