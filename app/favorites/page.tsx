'use client'
// ============================================================
// NEXUS STORE — /favorites PAGE
// ============================================================

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useFavoritesStore } from '@/src/stores/favoritesStore'
import { useCartStore } from '@/src/stores/cartStore'

export default function FavoritesPage() {
  const { items, removeFavorite, clearFavorites } = useFavoritesStore()
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="container max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between py-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Heart className="h-7 w-7 text-red-400 fill-red-400" />
              Saved Items
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {items.length === 0
                ? 'Your wishlist is empty'
                : `${items.length} item${items.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-6">
              <div className="h-24 w-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Heart className="h-10 w-10 text-red-500/40" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Nothing saved yet</h2>
            <p className="text-gray-400 text-sm max-w-xs mb-8">
              Tap the ♥ heart on any product to save it here for later.
            </p>
            <Link href="/store">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors">
                Browse the Store <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Add All to Cart */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => items.forEach((p) => addItem(p))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-sm font-bold hover:bg-cyan-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingCart className="h-4 w-4" />
                Add All to Cart
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((product) => {
                const outOfStock = product.stock === 0
                const hasDiscount = !!product.comparePrice
                const discountPct = hasDiscount
                  ? Math.round((1 - product.price / product.comparePrice!) * 100)
                  : 0

                return (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-500/30 transition-all hover:-translate-y-1"
                  >
                    {/* Remove from favorites */}
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-white/10 text-red-400 hover:bg-red-500/20 transition-all"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="h-4 w-4 fill-red-400" />
                    </button>

                    {/* Sale badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        -{discountPct}%
                      </div>
                    )}

                    {/* Image */}
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-3xl font-bold text-white/5 uppercase">
                            {product.category}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-0.5">{product.brand}</p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-sm font-bold text-white hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-3">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-white">€{product.price.toFixed(2)}</span>
                          {hasDiscount && (
                            <span className="ml-2 text-xs text-gray-500 line-through">
                              €{product.comparePrice!.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => !outOfStock && addItem(product)}
                          disabled={outOfStock}
                          className={`flex items-center gap-1.5 rounded-full px-4 h-8 text-xs font-semibold transition-all ${outOfStock
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-cyan-400'
                            }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {outOfStock ? 'Out of stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
