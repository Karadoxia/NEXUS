'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Product } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

type ProductForm = {
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  comparePrice: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
};

const EMPTY_FORM: ProductForm = {
  name: '', slug: '', brand: '', description: '', price: 0,
  comparePrice: 0, category: '', image: '', stock: 0, featured: false,
};

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [editing, setEditing]   = useState<Product | null>(null);
  const [form, setForm]         = useState<ProductForm>(EMPTY_FORM);
  const [open, setOpen]         = useState(false);
  const [saving, setSaving]     = useState(false);

  if (session && !(session.user as { isAdmin?: boolean })?.isAdmin) {
    redirect('/signin');
  }

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load products');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name:         p.name ?? '',
      slug:         p.slug ?? '',
      brand:        p.brand ?? '',
      description:  p.description ?? '',
      price:        p.price ?? 0,
      comparePrice: (p as unknown as { comparePrice?: number }).comparePrice ?? 0,
      category:     p.category ?? '',
      image:        p.image ?? '',
      stock:        p.stock ?? 0,
      featured:     p.featured ?? false,
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const method  = editing ? 'PUT' : 'POST';
      const payload = editing ? { id: editing.id, ...form } : form;
      const res     = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setOpen(false);
      fetchProducts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const field = (
    key: keyof ProductForm,
    type: 'text' | 'number' | 'checkbox' = 'text',
    placeholder = '',
  ) => {
    if (type === 'checkbox') {
      return (
        <label key={key} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={form[key] as boolean}
            onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
            className="accent-cyan-500"
          />
          {placeholder || key}
        </label>
      );
    }
    return (
      <input
        key={key}
        type={type}
        placeholder={placeholder || key}
        value={form[key] as string | number}
        onChange={(e) =>
          setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })
        }
        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-slate-500"
      />
    );
  };

  return (
    <div className="p-8 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} products in catalogue</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Product
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">Loading…</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-slate-500">No products yet</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{p.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{p.category}</td>
                    <td className="px-5 py-3 font-semibold text-white tabular-nums">€{p.price.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold tabular-nums ${p.stock < 10 ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.featured ? (
                        <span className="text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">Yes</span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          aria-label="Edit product"
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => del(p.id)}
                          aria-label="Delete product"
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editing ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {field('name',         'text',   'Product name')}
              {field('slug',         'text',   'URL slug')}
              {field('brand',        'text',   'Brand')}
              {field('description',  'text',   'Description')}
              {field('category',     'text',   'Category')}
              {field('price',        'number', 'Price (€)')}
              {field('comparePrice', 'number', 'Compare price (€)')}
              {field('stock',        'number', 'Stock quantity')}
              {field('image',        'text',   'Image URL')}
              {field('featured',     'checkbox', 'Mark as featured')}
            </div>
            <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-xl hover:border-slate-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
