'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Order } from '@/src/stores/orderStore';

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('failed');
        const list = await res.json();
        setOrders(list);
      } catch (e: any) {
        setError(e.message || 'unable to fetch');
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((o) => o.map(x => x.id === id ? data.order : x));
      }
    } catch {}
  };

  if (session?.user?.email !== 'admin@example.com') {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <p className="text-red-400">Unauthorized</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-2">ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Address</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-800 hover:bg-slate-900">
                <td className="p-2 font-mono text-sm">{o.id}</td>
                <td className="p-2 text-sm">{o.customer.email}</td>
                <td className="p-2 text-sm">€{o.total.toFixed(2)}</td>
                <td className="p-2 text-sm">{o.shippingAddress?.fullName || o.shippingAddress?.line1 || '-'}</td>
                <td className="p-2 text-sm">{o.status}</td>
                <td className="p-2">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="bg-slate-800 text-white rounded px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
