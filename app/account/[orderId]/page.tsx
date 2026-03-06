'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useOrderStore } from '@/src/stores/orderStore';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, CheckCircle, Truck, ChevronLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { getOrderByTracking } = useOrderStore();
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      // try local store first
      let o = getOrderByTracking(orderId) || useOrderStore.getState().orders.find(o => o.id === orderId);
      if (!o) {
        try {
          const res = await fetch(`/api/orders/${orderId}`);
          if (res.ok) {
            o = await res.json();
          }
        } catch {
          // ignore
        }
      }
      if (o) setOrder(o);
    }
    if (orderId) fetchOrder();
  }, [orderId, getOrderByTracking]);

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <p>Loading order…</p>
      </main>
    );
  }

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-amber-400" />;
      case 'processing':
        return <Package size={16} className="text-blue-400" />;
      case 'shipped':
        return <Truck size={16} className="text-purple-400" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <Link href="/account">
          <button className="flex items-center gap-2 text-sm text-cyan-400 mb-8">
            <ChevronLeft size={16} /> Back to orders
          </button>
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Order {order.id}</h1>
          <p className="text-sm text-slate-400 mb-2">
            Placed on {new Date(order.date).toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            Status: <StatusIcon status={order.status} /> {order.status.toUpperCase()}
          </p>

          {order.shippingAddress && (
            <div className="mb-6">
              <h2 className="font-bold mb-1">Shipping Address</h2>
              <p className="text-sm">
                {order.shippingAddress.fullName || order.shippingAddress.label}<br />
                {order.shippingAddress.line1}<br />
                {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.postal}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-bold mb-2">Items</h2>
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 mb-3">
                <div className="h-12 w-12 rounded overflow-hidden relative">
                  {item.images?.[0] ? (
                    <Image src={item.images[0]} alt="" fill className="object-cover" />
                  ) : (
                    <span className="text-xs">?</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-400">
                    {item.quantity} × €{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right font-bold text-white">
            Total: €{order.total.toLocaleString()}
          </div>
        </div>
      </div>
    </main>
  );
}
