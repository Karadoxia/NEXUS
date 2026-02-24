'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronRight, Package } from 'lucide-react';
import { createPortal } from 'react-dom';
import Fuse from 'fuse.js';
import Image from 'next/image';
import { products } from '@/data/products';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Lock body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Initialize Fuse
    // Memoize the Fuse instance to avoid recreation on every render
    const fuse = useMemo(() => new Fuse<Product>(products, {
        keys: ['name', 'description', 'category', 'brand', 'tags'],
        threshold: 0.3, // Fuzzy match threshold (0 = exact, 1 = match anything)
        includeScore: true
    }), []);

    const results = useMemo(() => {
        if (!query) return [];
        return fuse.search(query).slice(0, 5).map((result: { item: Product }) => result.item);
    }, [query, fuse]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!mounted || !isOpen) return null;

    const handleNavigate = (url: string) => {
        onClose();
        router.push(url);
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Search Header */}
                <div className="flex items-center border-b border-slate-800 p-4 gap-3">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products, categories, or tags..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-lg"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {query && results.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No results found for &quot;<span className="text-white">{query}</span>&quot;</p>
                        </div>
                    )}

                    {query && results.length > 0 && (
                        <div className="p-2">
                            <div className="text-xs font-bold text-slate-500 px-3 py-2 uppercase tracking-wider">
                                Products
                            </div>
                            {results.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleNavigate(`/products/${product.slug}`)}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 cursor-pointer group transition-colors"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-slate-800 overflow-hidden relative border border-slate-700">
                                        {product.images?.[0] && (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span className="capitalize">{product.category}</span>
                                            <span>•</span>
                                            <span>{product.brand}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-cyan-400">€{product.price.toLocaleString()}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!query && (
                        <div className="p-8 text-center">
                            <p className="text-slate-500 text-sm">
                                Try searching for <span className="text-cyan-400">&quot;Neural&quot;</span>, <span className="text-cyan-400">&quot;Workstation&quot;</span>, or <span className="text-cyan-400">&quot;High-End&quot;</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-950/50 border-t border-slate-800 p-3 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex gap-2">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</span> to close
                    </div>
                    <div>
                        <span className="text-cyan-400 font-bold">{products.length}</span> products indexed
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
