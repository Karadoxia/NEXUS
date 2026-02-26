'use client';

import { useState } from 'react';
import OrderStatusSelect from './order-status-select';
import OrderDrawer from './order-drawer';

type OrderRow = {
  id: string;
  total: number;
  status: string;
  date: string | Date;
  items: { quantity: number }[];
  user: { email: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-500/10  text-amber-400   border-amber-500/20',
  processing: 'bg-blue-500/10   text-blue-400    border-blue-500/20',
  shipped:    'bg-purple-500/10 text-purple-400  border-purple-500/20',
  delivered:  'bg-green-500/10  text-green-400   border-green-500/20',
  cancelled:  'bg-red-500/10    text-red-400     border-red-500/20',
};

interface Props {
  orders: OrderRow[];
}

export default function OrdersTableClient({ orders }: Props) {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  return (
    <>
      <tbody className="divide-y divide-slate-800/50">
        {orders.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-5 py-14 text-center text-slate-500 text-sm">
              No orders match this filter
            </td>
          </tr>
        ) : (
          orders.map((o) => (
            <tr
              key={o.id}
              className="hover:bg-slate-800/20 transition-colors group cursor-pointer"
              onClick={() => setActiveOrderId(o.id)}
            >
              <td className="px-5 py-3 font-mono text-xs text-slate-500 group-hover:text-slate-400">
                #{o.id.slice(-8).toUpperCase()}
              </td>
              <td className="px-5 py-3 text-slate-300 text-sm max-w-[180px] truncate">
                {o.user?.email ?? <span className="text-slate-600">Guest</span>}
              </td>
              <td className="px-5 py-3 text-slate-400 text-sm tabular-nums">
                {o.items.reduce((s, i) => s + i.quantity, 0)}
              </td>
              <td className="px-5 py-3 font-semibold text-white tabular-nums">
                €{o.total.toFixed(2)}
              </td>
              <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">
                {new Date(o.date).toLocaleDateString('en', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </td>
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase ${STATUS_COLORS[o.status] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {o.status}
                </span>
              </td>
              <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                <OrderStatusSelect orderId={o.id} currentStatus={o.status} />
              </td>
            </tr>
          ))
        )}
      </tbody>

      <OrderDrawer
        orderId={activeOrderId}
        onClose={() => setActiveOrderId(null)}
      />
    </>
  );
}
