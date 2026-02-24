'use client'
// ============================================================
// NEXUS STORE — /store PAGE
// Full catalog with: category filters, search, sort, grid/list
// ============================================================

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search, SlidersHorizontal, Grid3X3, List,
  ChevronDown, X, Star
} from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { ProductCategory } from '@/types'
import Image from 'next/image'

const CATEGORIES: { value: ProductCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Products', icon: '⚡' },
  { value: 'peripherals', label: 'Peripherals', icon: '🖱️' },
  { value: 'laptops', label: 'Laptops', icon: '💻' },
  { value: 'workstations', label: 'Workstations', icon: '🖥️' },
  { value: 'monitors', label: 'Monitors', icon: '🖵' },
  { value: 'networking', label: 'Networking', icon: '📡' },
  { value: 'storage', label: 'Storage', icon: '💾' },
  { value: 'components', label: 'Components', icon: '🔧' },
  { value: 'accessories', label: 'Accessories', icon: '🎧' },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest First' },
]

const PRICE_RANGES = [
  { label: 'Under €100', min: 0, max: 100 },
  { label: '€100 – €500', min: 100, max: 500 },
  { label: '€500 – €1,500', min: 500, max: 1500 },
  { label: '€1,500 – €3,000', min: 1500, max: 3000 },
  { label: 'Over €3,000', min: 3000, max: Infinity },
]

import { Suspense } from 'react'

function StoreContent() {
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<any[]>([])
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [])
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [sort, setSort] = useState('featured')
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [onlySale, setOnlySale] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]

    // Search
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t: string) => t.includes(q))
      )
    }

    // Category
    if (category !== 'all') list = list.filter((p) => p.category === category)

    // Price
    if (priceRange) {
      list = list.filter(
        (p) => p.price >= priceRange.min && p.price <= priceRange.max
      )
    }

    // Stock
    if (onlyInStock) list = list.filter((p) => p.stock > 0)

    // Sale
    if (onlySale) list = list.filter((p) => !!p.comparePrice)

    // Sort
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'newest': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return list
  }, [query, category, sort, priceRange, onlyInStock, onlySale])

  const activeFiltersCount = [
    category !== 'all',
    priceRange !== null,
    onlyInStock,
    onlySale,
  ].filter(Boolean).length

  const clearFilters = () => {
    setCategory('all')
    setPriceRange(null)
    setOnlyInStock(false)
    setOnlySale(false)
    setQuery('')
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">

      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <div className="border-b border-white/5 bg-black/80 sticky top-16 z-30 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" suppressHydrationWarning />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 transition-all"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Toggle (mobile) */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-colors ${filtersOpen || activeFiltersCount > 0
                  ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-400'
                  : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
              >
                <SlidersHorizontal className="h-4 w-4" suppressHydrationWarning />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-black">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-8 text-sm text-gray-300 outline-none focus:border-cyan-500/50 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-gray-900">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" suppressHydrationWarning />
              </div>

              {/* View Toggle */}
              <div className="flex rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`h-10 w-10 flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <Grid3X3 className="h-4 w-4" suppressHydrationWarning />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`h-10 w-10 flex items-center justify-center transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  <List className="h-4 w-4" suppressHydrationWarning />
                </button>
              </div>
            </div>
          </div>

          {/* ── FILTER PANEL ───────────────────────────── */}
          {filtersOpen && (
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6">

              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value as ProductCategory | 'all')}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${category === c.value
                        ? 'bg-cyan-500 text-black'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Price Range</p>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((r) => (
                    <button
                      key={r.label}
                      onClick={() =>
                        setPriceRange(
                          priceRange?.min === r.min && priceRange?.max === r.max
                            ? null
                            : { min: r.min, max: r.max }
                        )
                      }
                      className={`w-full text-left rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${priceRange?.min === r.min && priceRange?.max === r.max
                        ? 'bg-cyan-500 text-black'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                        }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Filters</p>
                <div className="space-y-2">
                  {[
                    { label: 'In Stock Only', value: onlyInStock, set: setOnlyInStock, icon: '✅' },
                    { label: 'On Sale', value: onlySale, set: setOnlySale, icon: '🔥' },
                  ].map(({ label, value, set, icon }) => (
                    <button
                      key={label}
                      onClick={() => set(!value)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${value
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                        }`}
                    >
                      <span>{icon}</span> {label}
                      <div className={`ml-auto h-4 w-8 rounded-full transition-colors ${value ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                        <div className={`h-4 w-4 rounded-full bg-white transition-transform shadow ${value ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {activeFiltersCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="h-4 w-4" suppressHydrationWarning /> Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CATEGORY PILLS (quick nav) ──────────────────── */}
      <div className="border-b border-white/5 overflow-x-auto">
        <div className="container flex gap-2 py-3 min-w-max md:min-w-0">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value as ProductCategory | 'all')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${category === c.value
                ? 'bg-cyan-500 text-black'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS ─────────────────────────────────────── */}
      <div className="container py-8">

        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">{filtered.length}</span> products found
            {query && <span> for &quot;<span className="text-cyan-400">{query}</span>&quot;</span>}
          </p>

          {/* Active filter tags */}
          <div className="flex gap-2">
            {category !== 'all' && (
              <span className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-300">
                {category}
                <button onClick={() => setCategory('all')} className="ml-1 text-gray-500 hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {onlySale && (
              <span className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs text-red-400">
                Sale <X className="h-3 w-3 cursor-pointer" onClick={() => setOnlySale(false)} />
              </span>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search or clearing filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-3">
            {filtered.map((product) => (
              <a
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all group"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">{product.brand}</p>
                  <h3 className="text-sm font-bold text-white mt-0.5">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" suppressHydrationWarning />
                    <span className="text-xs text-amber-400">{product.rating}</span>
                    <span className="text-xs text-gray-600">({product.reviewCount})</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-white">€{product.price.toFixed(2)}</div>
                  {product.comparePrice && (
                    <div className="text-xs text-gray-500 line-through">€{product.comparePrice.toFixed(2)}</div>
                  )}
                  <span className={`text-xs mt-1 ${product.stock === 0 ? 'text-red-400' : product.stock <= 5 ? 'text-amber-400' : 'text-green-400'}`}>
                    {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `${product.stock} left` : 'In stock'}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">Loading Store...</div>}>
      <StoreContent />
    </Suspense>
  )
}
