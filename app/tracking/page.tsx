'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useOrderStore } from '@/src/stores/orderStore';
import { Navbar } from '@/components/navbar';
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function TrackingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    // phone logic: track by tracking number or order id
    const order = useOrderStore(state =>
        state.orders.find(o => o.trackingNumber === id || o.id === id)
    );

    const [input, setInput] = useState(id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            router.push(`/tracking?id=${encodeURIComponent(input.trim())}`);
        }
    }

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!id) {
        return (
            <div className="container mx-auto px-4 py-32 text-center text-slate-400">
                <form onSubmit={handleSearch} className="flex flex-col items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter order or tracking ID"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="w-full max-w-sm rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-500 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg"
                    >
                        Search
                    </button>
                </form>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-32 text-center text-slate-400">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <h1 className="text-2xl font-bold text-white mb-2">Tracking Not Found</h1>
                <p>We couldn&apos;t find a shipment with tracking number <span className="font-mono text-cyan-400">{id}</span>.</p>
                <Link href="/store" className="inline-block mt-8 text-cyan-400 hover:underline">Return to Store</Link>
            </div>
        );
    }

    const steps = [
        { status: 'ordered', label: 'Ordered', icon: Package },
        { status: 'shipped', label: 'Shipped', icon: Truck },
        { status: 'in-transit', label: 'In Transit', icon: MapPin },
        { status: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
        { status: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === (order.shipmentEvents?.[order.shipmentEvents.length - 1]?.status || 'ordered'));

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="max-w-3xl mx-auto">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">Tracking ID: <span className="text-cyan-400 font-mono">{id}</span></h1>
                            <p className="text-slate-400 text-sm">Carrier: {order.carrier}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400">Estimated Delivery</p>
                            <p className="text-xl font-bold text-white">{new Date(order.estimatedDelivery || '').toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative mb-12 px-4">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-cyan-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        />

                        <div className="relative flex justify-between w-full">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.status} className="flex flex-col items-center gap-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-500 ${isActive
                                            ? 'bg-cyan-500 border-slate-900 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                                            : 'bg-slate-900 border-slate-800 text-slate-600'
                                            }`}>
                                            <Icon size={16} />
                                        </div>
                                        <span className={`text-xs font-medium absolute -bottom-8 w-24 text-center ${isCurrent ? 'text-white' : isActive ? 'text-cyan-400' : 'text-slate-600'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Event History */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8">
                    <h2 className="text-xl font-bold mb-6">Shipment Updates</h2>
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                        {order.shipmentEvents?.slice().reverse().map((event) => ( // Show newest first
                            <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-900 bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/50 shadow">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-white text-sm">{event.status.toUpperCase()}</div>
                                        <time className="font-mono text-xs text-slate-500">{new Date(event.date).toLocaleString()}</time>
                                    </div>
                                    <div className="text-slate-400 text-sm">
                                        {event.details} <span className="text-slate-600">• {event.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function TrackingPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <TrackingContent />
            </Suspense>
        </main>
    );
}
