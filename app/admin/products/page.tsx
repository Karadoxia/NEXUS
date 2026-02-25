'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<any>({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchProducts();
    };
    fetch();
  }, []);

  const save = async () => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const payload = editing ? { id: editing.id, ...form } : form;
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      fetchProducts();
      setEditing(null);
      setForm({});
    } catch (e) {}
  };

  const del = async (id: string) => {
    if (!confirm('Delete product?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  if (!(session?.user as { isAdmin?: boolean })?.isAdmin) {
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
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <button
          className="mb-4 bg-cyan-600 py-2 px-4 rounded"
          onClick={() => { setEditing(null); setForm({}); }}
        >
          New Product
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-900">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">€{p.price}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    <button
                      className="text-xs text-cyan-400 mr-2"
                      onClick={() => { setEditing(p); setForm(p); }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-400"
                      onClick={() => del(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* form modal-like */}
        {(editing !== null || Object.keys(form).length > 0) && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-slate-900 p-6 rounded-lg w-full max-w-xl">
              <h2 className="text-xl font-bold mb-4">{editing ? 'Edit' : 'New'} Product</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name||''}
                  onChange={e => setForm({...form,name:e.target.value})}
                  className="w-full bg-slate-800 p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Slug"
                  value={form.slug||''}
                  onChange={e => setForm({...form,slug:e.target.value})}
                  className="w-full bg-slate-800 p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price||0}
                  onChange={e => setForm({...form,price:Number(e.target.value)})}
                  className="w-full bg-slate-800 p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock||0}
                  onChange={e => setForm({...form,stock:Number(e.target.value)})}
                  className="w-full bg-slate-800 p-2 rounded"
                />
                {/* more fields can be added similarly */}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className="bg-gray-600 px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({}); }}>Cancel</button>
                <button className="bg-cyan-600 px-4 py-2 rounded" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
