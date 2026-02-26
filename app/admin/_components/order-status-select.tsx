'use client';

import { useState } from 'react';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const update = async (next: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (data.success) setStatus(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => update(e.target.value)}
      disabled={loading}
      className="bg-slate-800/80 text-white rounded-lg px-2 py-1.5 text-xs border border-slate-700 focus:border-cyan-500 outline-none cursor-pointer disabled:opacity-50 transition-colors hover:border-slate-600"
      aria-label="Order status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
