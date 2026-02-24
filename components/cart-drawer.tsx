'use client';

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/src/stores/cartStore';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
    const { items, isOpen, closeCart, updateQuantity, removeItem, total } = useCartStore();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-black border-l border-cyan-900/50 shadow-[0_0_50px_rgba(8,145,178,0.2)] z-50 flex flex-col transform transition-transform duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cyan-900/30">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="text-cyan-400" />
                        <h2 className="text-xl font-bold text-white tracking-tighter">CART ({items.length})</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                            <ShoppingBag size={48} className="opacity-20" />
                            <p>Your cart is empty.</p>
                            <button
                                onClick={closeCart}
                                className="text-cyan-400 hover:text-cyan-300 text-sm font-bold"
                            >
                                BROWSE PRODUCTS
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                {/* Image Placeholder */}
                                <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 text-xs text-slate-600 overflow-hidden relative">
                                    <Image src={item.images?.[0] || ''} alt={item.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-white leading-tight">{item.name}</h3>
                                        <p className="text-xs text-slate-400 mt-1 uppercase">{item.category}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-cyan-400 font-mono font-bold">
                                            €{item.price.toLocaleString()}
                                        </p>

                                        <div className="flex items-center gap-3 bg-slate-900 rounded-lg px-2 py-1 border border-slate-800">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-slate-600 hover:text-red-500 transition-colors self-start"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-cyan-900/30 bg-black/50 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400">Total</span>
                            <span className="text-2xl font-bold text-white font-mono">
                                €{total().toLocaleString()}
                            </span>
                        </div>
                        <Link href="/checkout" onClick={closeCart}>
                            <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-[1.02]">
                                CHECKOUT SECURELY
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
