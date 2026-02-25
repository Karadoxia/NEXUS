'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Package, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
    nexus:             { label: 'NEXUS',          color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' },
    ebay:              { label: 'eBay',            color: 'text-red-400 bg-red-950/40 border-red-500/30' },
    'google-shopping': { label: 'Google Shopping', color: 'text-blue-400 bg-blue-950/40 border-blue-500/30' },
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery]           = useState('');
    const [groups, setGroups]         = useState<Record<string, any[]>>({});
    const [loading, setLoading]       = useState(false);
    const [total, setTotal]           = useState(0);
    const [mounted, setMounted]       = useState(false);
    const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router                      = useRouter();

    useEffect(() => { setMounted(true); }, []);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) { setQuery(''); setGroups({}); setTotal(0); }
    }, [isOpen]);

    // Debounced live search across DB + all vendors
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query || query.length < 2) {
            setGroups({});
            setTotal(0);
            setLoading(false);
            return;
        }
        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setGroups(data.groups ?? {});
                setTotal(data.total ?? 0);
            } catch {
                setGroups({});
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query]);

    // Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!mounted || !isOpen) return null;

    const handleNavigate = (url: string) => { onClose(); router.push(url); };

    const allSources = Object.keys(groups);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Search Header */}
                <div className="flex items-center border-b border-slate-800 p-4 gap-3">
                    {loading
                        ? <Loader2 className="h-5 w-5 text-cyan-500 animate-spin flex-shrink-0" />
                        : <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    }
                    <input
                        type="text"
                        placeholder="Search across all vendors…"
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-lg"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <button type="button" aria-label="Close search" onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">

                    {/* Empty query hint */}
                    {!query && (
                        <div className="p-8 text-center">
                            <p className="text-slate-500 text-sm">
                                Search <span className="text-cyan-400">"laptop"</span>,{' '}
                                <span className="text-cyan-400">"gaming"</span>,{' '}
                                <span className="text-cyan-400">"neural"</span>…
                            </p>
                            <p className="text-slate-600 text-xs mt-2">Results from NEXUS catalog, eBay, and Google Shopping</p>
                        </div>
                    )}

                    {/* No results */}
                    {query && query.length >= 2 && !loading && total === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No results for &quot;<span className="text-white">{query}</span>&quot;</p>
                        </div>
                    )}

                    {/* Grouped results by vendor */}
                    {allSources.map((source) => {
                        const items = groups[source];
                        if (!items?.length) return null;
                        const meta = SOURCE_LABELS[source] ?? { label: source, color: 'text-gray-400 bg-white/5 border-white/10' };
                        return (
                            <div key={source} className="p-2">
                                {/* Source badge */}
                                <div className="flex items-center gap-2 px-3 py-2">
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
                                        {meta.label}
                                    </span>
                                    <span className="text-xs text-slate-600">{items.length} results</span>
                                </div>

                                {items.slice(0, 5).map((product: any, i: number) => (
                                    <div
                                        key={product.id ?? i}
                                        onClick={() => handleNavigate(`/products/${product.slug}`)}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 cursor-pointer group transition-colors"
                                    >
                                        {/* Thumbnail */}
                                        <div className="h-12 w-12 rounded-lg bg-slate-800 overflow-hidden relative border border-slate-700 flex-shrink-0">
                                            {product.images?.[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors text-sm">
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span className="capitalize">{product.category}</span>
                                                <span>·</span>
                                                <span>{product.brand}</span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right flex-shrink-0">
                                            <span className="font-bold text-cyan-400 text-sm">
                                                €{product.price?.toLocaleString?.() ?? product.price}
                                            </span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-white flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="bg-slate-950/50 border-t border-slate-800 p-3 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex gap-2">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">ESC</span> to close
                    </div>
                    {total > 0 && (
                        <div>
                            <span className="text-cyan-400 font-bold">{total}</span> results across {allSources.length} source{allSources.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
