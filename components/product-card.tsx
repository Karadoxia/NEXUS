'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/src/stores/cartStore';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCartStore();
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const [isHovered, setIsHovered] = useState(false);

    const isFav = isFavorite(product.id);
    const [particles, setParticles] = useState<Array<{id:number; x:number; y:number}>>([]);

    const spawnParticles = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const baseX = rect.left + rect.width/2;
        const baseY = rect.top + rect.height/2;
        const newParticles = Array.from({length:5},(_,i)=>({id:Date.now()+i, x:baseX, y:baseY}));
        setParticles(p=>[...p,...newParticles]);
        setTimeout(()=>{
            setParticles(p=>p.filter(pt=>!newParticles.find(np=>np.id===pt.id)));
        }, 800);
    };

    return (
        <div
            className="group relative bg-slate-900 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_-5px_rgba(8,145,178,0.3)] transition-all duration-300 hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.isNew && (
                    <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-sm">
                        NEW ARRIVAL
                    </span>
                )}
                {product.comparePrice && (
                    <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-1 rounded border border-purple-500/30 backdrop-blur-sm">
                        SALE -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                    </span>
                )}
            </div>

            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product);
                }}
                className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${isFav
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/40'
                    : 'bg-black/40 text-slate-400 hover:bg-black/60 hover:text-white'
                    }`}
            >
                <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-white'} suppressHydrationWarning />
            </button>

            {/* Image Area */}
            <Link href={`/products/${product.slug}`} className="block aspect-[4/3] bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Real Image */}
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                        suppressHydrationWarning
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold uppercase tracking-widest text-xs">
                        {product.category}
                    </div>
                )}

                {/* Quick Add Overlay */}
                <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            spawnParticles(e);
                            addItem(product);
                        }}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                        <ShoppingCart size={16} suppressHydrationWarning />
                        ADD TO CART
                    </button>
                </div>
            </Link>
            {/* particle effects */}
            {particles.map(p=> (
                <span key={p.id} className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-particle" style={{left:p.x, top:p.y}} />
            ))}

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/products/${product.slug}`}>
                        <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        IN STOCK
                    </div>
                </div>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2 h-10">{product.description}</p>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-slate-500 font-mono mb-1">UNIT PRICE</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-white">€{product.price.toLocaleString()}</span>
                            {product.comparePrice && (
                                <span className="text-xs text-slate-500 line-through">€{product.comparePrice.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
