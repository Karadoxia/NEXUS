'use client';

import { products } from '@/data/products';
import { ProductCard } from './product-card';

export function ProductGrid() {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-cyan-500/50" />
                        <span className="text-cyan-500 font-mono text-sm tracking-widest">CATALOG_V3.0</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-sm text-white border-b border-cyan-500 pb-1">ALL SYSTEMS</button>
                        <button className="text-sm text-slate-500 hover:text-white transition-colors">PERIPHERALS</button>
                        <button className="text-sm text-slate-500 hover:text-white transition-colors">COMPONENTS</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="px-8 py-3 rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all text-sm font-medium tracking-wide">
                        LOAD_MORE_ASSETS +
                    </button>
                </div>
            </div>
        </section>
    );
}
