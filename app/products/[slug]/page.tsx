'use client'
// ============================================================
// NEXUS STORE — /product/[slug] PAGE
// Full product detail: gallery, specs, reviews, add to cart
// ============================================================

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  Heart, ShoppingCart, Star, Check,
  Shield, Zap, RotateCcw, Truck, Share2, ChevronDown, Box, Activity
} from 'lucide-react'
import { PriceHistory } from '@/components/price-history'
import { ProductSchema } from '@/components/sdo/product-schema'
// Dynamic import for 3D canvas (heavy)
const ProductCanvas = dynamic(() => import('@/components/product-canvas').then(mod => mod.ProductCanvas), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] bg-slate-900 animate-pulse rounded-2xl" />
})

import { useCartStore } from '@/src/stores/cartStore'
import { useFavoritesStore } from '@/src/stores/favoritesStore'

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug || '';
  const [product, setProduct] = useState<any>(null);
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setProduct)
      .catch(() => {
        notFound();
      });
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(0)
  const [show3D, setShow3D] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(true)
  const [reviewsOpen, setReviewsOpen] = useState(false)

  /* Hydration fix: Wait for client mount before checking localStorage */
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const addItem = useCartStore((s) => s.addItem)
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const favorite = isMounted && product ? isFavorite(product.id) : false
  const outOfStock = product?.stock === 0
  const hasDiscount = !!product?.comparePrice
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.comparePrice!) * 100)
    : 0

  const handleAddToCart = () => {
    if (outOfStock) return
    addItem(product, quantity)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

// Related products (fetched from API)
  const [related, setRelated] = useState<any[]>([]);
  useEffect(() => {
    if (!product) return;
    fetch('/api/products')
      .then((r) => r.json())
      .then((all: any[]) => {
        const scored = all
          .filter((p) => p.id !== product.id)
          .map((p) => {
            let score = 0;
            if (p.category === product.category) score += 3;
            if (p.brand === product.brand) score += 1;
            const commonTags = p.tags?.filter((tag: string) => product.tags?.includes(tag)).length || 0;
            score += commonTags * 2;
            return { ...p, relevance: score };
          })
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 4);
        setRelated(scored);
      });
  }, [product]);

  // Dummy reviews
  const reviews = [
    { id: 1, author: 'Alex M.', rating: 5, date: 'Jan 2026', title: 'Absolutely worth every cent', body: 'Build quality is outstanding. Performance exceeded my expectations. Shipping was fast. Will definitely order again from NEXUS.' },
    { id: 2, author: 'Sarah K.', rating: 4, date: 'Dec 2025', title: 'Great product, minor caveat', body: 'Works exactly as advertised. Setup was straightforward. Docking 1 star because packaging could be improved, but the product itself is flawless.' },
    { id: 3, author: 'Redbend D.', rating: 5, date: 'Nov 2025', title: 'Pro-level quality', body: 'This is the real deal. I was skeptical at first but it completely replaced my old setup. No going back.' },
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20">
      <div className="container">

        {/* Breadcrumb ... (unchanged) */}
        <ProductSchema product={product} />

        {/* ── MAIN PRODUCT SECTION ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* LEFT: Gallery */}
          <div className="space-y-4">
            {/* Main Image / 3D Canvas */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 group">

              {show3D ? (
                <ProductCanvas color="#06b6d4" />
              ) : (
                <>
                  {/* Badges ... (unchanged) */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="flex items-center gap-1 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-black">
                        <Zap className="h-3 w-3" /> NEW
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Favorite ... (unchanged) */}
                  <button
                    onClick={() => toggleFavorite(product)}
                    className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl transition-all ${favorite
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-black/40 text-gray-400 border border-white/10 hover:text-red-400'
                      }`}
                  >
                    <Heart className={`h-5 w-5 ${favorite ? 'fill-red-400' : ''}`} />
                  </button>

                  {product.images[selectedImage] ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl font-bold text-white/5 uppercase">
                      {product.category}
                    </div>
                  )}
                </>
              )}

              {/* 3D Toggle Button */}
              <button
                onClick={() => setShow3D(!show3D)}
                className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${show3D
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10'
                  }`}
              >
                <Box className="h-4 w-4" />
                {show3D ? 'EXIT 3D VIEW' : 'VIEW IN 3D'}
              </button>
            </div>

            {/* Thumbnails ... (unchanged) */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setShow3D(false); }}
                    className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === i && !show3D
                      ? 'border-cyan-500'
                      : 'border-white/10 hover:border-white/30'
                      }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">

            {/* Brand + Category */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium text-cyan-400 border border-cyan-900/50 bg-cyan-950/30 px-2 py-1 rounded capitalize">
                {product.category}
              </span>
              <span className="text-sm font-semibold text-gray-400">{product.brand}</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-amber-400">{product.rating}</span>
              <button
                className="text-sm text-gray-500 hover:text-white underline underline-offset-2 transition-colors"
                onClick={() => setReviewsOpen(true)}
              >
                {product.reviewCount.toLocaleString()} reviews
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-6 text-sm">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-end gap-3 mb-8">
              <span className="text-4xl font-bold text-white">
                €{product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through mb-1">
                    €{product.comparePrice!.toFixed(2)}
                  </span>
                  <span className="mb-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">
                    Save €{(product.comparePrice! - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Price History */}
            <div className="mb-8 p-4 rounded-xl border border-white/5 bg-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Price Trend (30 Days)</span>
              </div>
              <PriceHistory />
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`h-2 w-2 rounded-full ${outOfStock ? 'bg-red-500' :
                product.stock <= 5 ? 'bg-amber-500 animate-pulse' :
                  'bg-green-500'
                }`} />
              <span className={`text-sm ${outOfStock ? 'text-red-400' :
                product.stock <= 5 ? 'text-amber-400' :
                  'text-green-400'
                }`}>
                {outOfStock
                  ? 'Out of stock'
                  : product.stock <= 5
                    ? `Only ${product.stock} left in stock — order soon`
                    : `In stock (${product.stock} units)`}
              </span>
            </div>

            {/* Quantity + CTA */}
            <div className="flex gap-3 mb-6">
              {/* Quantity */}
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={outOfStock}
                  className="h-12 w-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-lg disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all duration-200 ${outOfStock
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : addedFeedback
                    ? 'bg-green-500 text-black scale-[0.98]'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                {addedFeedback ? (
                  <><Check className="h-4 w-4" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: Truck, text: 'Free EU Shipping', sub: 'Orders over €99' },
                { icon: RotateCcw, text: '30-Day Returns', sub: 'No questions asked' },
                { icon: Shield, text: '2-Year Warranty', sub: 'Manufacturer covered' },
                { icon: Zap, text: 'Fast Dispatch', sub: 'Ships within 24h' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                  <Icon className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">{text}</p>
                    <p className="text-[10px] text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <button
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors self-start"
            >
              <Share2 className="h-3.5 w-3.5" /> Share this product
            </button>
          </div>
        </div>

        {/* ── SPECS ACCORDION ──────────────────────────── */}
        <div className="mb-6 rounded-2xl border border-white/10 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
            onClick={() => setSpecsOpen(!specsOpen)}
          >
            <span className="font-bold text-white">Technical Specifications</span>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${specsOpen ? 'rotate-180' : ''}`} />
          </button>
          {specsOpen && (
            <div className="border-t border-white/10 divide-y divide-white/5">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex items-center px-6 py-3">
                  <span className="text-sm text-gray-400 w-48 flex-shrink-0">{key}</span>
                  <span className="text-sm text-white font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── REVIEWS ACCORDION ────────────────────────── */}
        <div className="mb-16 rounded-2xl border border-white/10 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
            onClick={() => setReviewsOpen(!reviewsOpen)}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">Customer Reviews</span>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviewCount.toLocaleString()})</span>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${reviewsOpen ? 'rotate-180' : ''}`} />
          </button>
          {reviewsOpen && (
            <div className="border-t border-white/10 divide-y divide-white/5">
              {reviews.map((review) => (
                <div key={review.id} className="px-6 py-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{review.author}</span>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Verified Purchase
                        </span>
                      </div>
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{review.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{review.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RELATED PRODUCTS ─────────────────────────── */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              More <span className="text-cyan-400 capitalize">{product.category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p: any) => (
                <a
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:border-cyan-500/50 hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-square relative bg-gray-900">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">{p.brand}</p>
                    <p className="text-sm font-bold text-white mt-0.5 line-clamp-1">{p.name}</p>
                    <p className="text-sm font-bold text-cyan-400 mt-1">€{p.price.toFixed(2)}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
