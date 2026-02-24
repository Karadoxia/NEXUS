'use client';

import { useOrderStore, Order } from '@/src/stores/orderStore';
import { Navbar } from '@/components/navbar';
import { Package, TrendingUp, Users, AlertCircle, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminPage() {
    const { orders, getRevenue, updateStatus, updateShipment } = useOrderStore();
    const [revenue, setRevenue] = useState(0);
    const [activeOrders, setActiveOrders] = useState(0);

    // Hydration fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        setRevenue(getRevenue());
        setActiveOrders(orders.filter(o => o.status !== 'delivered').length);
    }, [orders, getRevenue]);

    if (!mounted) return null;

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            delivered: 'bg-green-500/10 text-green-400 border-green-500/20'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${styles[status as keyof typeof styles]}`}>
                {status}
            </span>
        );
    };

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-2">
                        <AlertCircle size={12} /> MOCK MODE ACTIVE
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stats */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-slate-400 text-sm font-medium">Total Revenue</h3>
                            <TrendingUp className="text-green-400" size={20} />
                        </div>
                        <p className="text-3xl font-bold text-white">€{revenue.toLocaleString()}</p>
                        <span className="text-green-400 text-xs">Based on local history</span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-slate-400 text-sm font-medium">Active Orders</h3>
                            <Package className="text-cyan-400" size={20} />
                        </div>
                        <p className="text-3xl font-bold text-white">{activeOrders}</p>
                        <span className="text-cyan-400 text-xs">{orders.length} total lifetime</span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-slate-400 text-sm font-medium">Mock Customers</h3>
                            <Users className="text-purple-400" size={20} />
                        </div>
                        <p className="text-3xl font-bold text-white">1</p>
                        <span className="text-slate-500 text-xs">Guest User</span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 overflow-hidden">
                    <h2 className="text-xl font-bold mb-6">Recent Orders</h2>

                    {orders.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No orders found in local storage.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                        <div className="h-10 w-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-xs">
                                            ORD
                                        </div>
                                        <div>
                                            <p className="font-medium text-white text-sm">{order.id}</p>
                                            <p className="text-xs text-slate-500">{new Date(order.date).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">€{order.total.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500">{order.items.length} items</p>
                                        </div>

                                        <StatusBadge status={order.status} />

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {(order.status === 'pending' || order.status === 'processing') && (
                                                <button
                                                    onClick={() => {
                                                        const tracking = 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                                                        updateShipment(order.id, tracking, 'MockExpress');
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded text-xs font-bold transition-colors"
                                                >
                                                    <Truck size={14} /> Fulfill
                                                </button>
                                            )}

                                            <select
                                                className="bg-black border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-500 outline-none"
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
