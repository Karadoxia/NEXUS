'use client';

import { useEffect, useState } from 'react';
import { X, Package, MapPin, Truck, User } from 'lucide-react';

type Product = { name: string; image: string | null; slug: string };
type Item = { id: string; quantity: number; price: number; product: Product };
type OrderDetail = {
  id: string;
  total: number;
  status: string;
  date: string;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDelivery: string | null;
  shippingAddress: Record<string, string> | null;
  user: { email: string; name: string | null } | null;
  items: Item[];
};

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-500/10  text-amber-400   border-amber-500/20',
  processing: 'bg-blue-500/10   text-blue-400    border-blue-500/20',
  shipped:    'bg-purple-500/10 text-purple-400  border-purple-500/20',
  delivered:  'bg-green-500/10  text-green-400   border-green-500/20',
  cancelled:  'bg-red-500/10    text-red-400     border-red-500/20',
};

interface Props {
  orderId: string | null;
  onClose: () => void;
}

export default function OrderDrawer({ orderId, onClose }: Props) {
  const [order, setOrder]   = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) { setOrder(null); return; }
    setLoading(true);
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (!orderId) return null;

  const addr = order?.shippingAddress as Record<string, string> | null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#070e1b] border-l border-slate-800 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Order Detail</h2>
            {order && (
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                #{order.id.slice(-8).toUpperCase()}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {loading && (
            <p className="text-slate-500 text-sm text-center py-12">Loading…</p>
          )}

          {!loading && order && (
            <>
              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-2.5 py-1 text-[11px] font-bold rounded border uppercase ${STATUS_COLORS[order.status] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {order.status}
                </span>
                <span className="text-slate-500 text-xs">
                  {new Date(order.date).toLocaleDateString('en', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </span>
                <span className="ml-auto text-xl font-bold text-white tabular-nums">
                  €{order.total.toFixed(2)}
                </span>
              </div>

              {/* Customer */}
              {order.user && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <User size={14} className="text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-sm text-white">{order.user.name ?? order.user.email}</p>
                    {order.user.name && (
                      <p className="text-xs text-slate-500">{order.user.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package size={11} />
                  Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                </p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2.5 px-3 bg-slate-900/40 border border-slate-800/60 rounded-xl">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-800 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center">
                          <Package size={14} className="text-slate-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-white tabular-nums shrink-0">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping address */}
              {addr && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={11} />
                    Shipping Address
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {[addr.line1, addr.line2, addr.city, addr.state, addr.postal, addr.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}

              {/* Tracking */}
              {(order.trackingNumber || order.carrier) && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Truck size={11} />
                    Tracking
                  </p>
                  <p className="text-sm text-slate-300">
                    {order.carrier && <span className="font-medium text-white">{order.carrier}</span>}
                    {order.carrier && order.trackingNumber && ' · '}
                    {order.trackingNumber && (
                      <span className="font-mono text-cyan-400">{order.trackingNumber}</span>
                    )}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="text-xs text-slate-500 mt-1">
                      Est. delivery:{' '}
                      {new Date(order.estimatedDelivery).toLocaleDateString('en', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
