'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/lib/mockData'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface CollectionClientProps {
  initialProducts: Product[]
  dict: Dictionary
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest'
type FinishFilter = 'all' | 'silver-steel' | 'gold-steel'

export function CollectionClient({ initialProducts, dict }: CollectionClientProps) {
  const [sort, setSort] = useState<SortOption>('featured')
  const [finishFilter, setFinishFilter] = useState<FinishFilter>('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const filteredAndSorted = useMemo(() => {
    let result = [...initialProducts]

    // Apply filters
    if (inStockOnly) {
      result = result.filter(p => p.inStock)
    }
    if (finishFilter !== 'all') {
      result = result.filter(p => p.finish === finishFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
          return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1
        case 'featured':
        default:
          // Featured = Best sellers first
          return a.isBestSeller === b.isBestSeller ? 0 : a.isBestSeller ? -1 : 1
      }
    })

    return result
  }, [initialProducts, sort, finishFilter, inStockOnly])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between py-4 border-b border-brand-border">
        <span className="text-sm font-medium text-brand-muted">
          {filteredAndSorted.length} {dict.product.relatedProducts.split(' ')[0]} {/* Simple count fallback */}
        </span>
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-brand-text"
        >
          <SlidersHorizontal size={16} />
          {dict.product.filterBy}
        </button>
      </div>

      {/* Filters Sidebar */}
      <aside className={cn(
        "fixed inset-0 z-[var(--z-drawer)] bg-brand-surface lg:static lg:block lg:w-64 lg:bg-transparent transition-transform duration-300 lg:translate-x-0 lg:z-auto flex flex-col",
        isMobileFilterOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-brand-border lg:hidden">
          <h2 className="text-lg font-semibold text-brand-text">{dict.product.filterBy}</h2>
          <button onClick={() => setIsMobileFilterOpen(false)} className="p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-0 space-y-8">
          {/* Sort */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-text">{dict.product.sortBy}</h3>
            <div className="flex flex-col gap-2 text-sm text-brand-muted">
              {[
                { value: 'featured', label: dict.product.sortFeatured },
                { value: 'price-asc', label: dict.product.sortPriceAsc },
                { value: 'price-desc', label: dict.product.sortPriceDesc },
                { value: 'newest', label: dict.product.sortNewest },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:text-brand-text">
                  <input
                    type="radio"
                    name="sort"
                    value={opt.value}
                    checked={sort === opt.value}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="text-brand-gold focus:ring-brand-gold accent-brand-gold"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Finish Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-text">{dict.product.finish}</h3>
            <div className="flex flex-col gap-2 text-sm text-brand-muted">
              <label className="flex items-center gap-2 cursor-pointer hover:text-brand-text">
                <input
                  type="radio"
                  name="finish"
                  value="all"
                  checked={finishFilter === 'all'}
                  onChange={() => setFinishFilter('all')}
                  className="accent-brand-gold"
                />
                {dict.nav.viewAll}
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-brand-text">
                <input
                  type="radio"
                  name="finish"
                  value="silver-steel"
                  checked={finishFilter === 'silver-steel'}
                  onChange={() => setFinishFilter('silver-steel')}
                  className="accent-brand-gold"
                />
                {dict.product.silverSteel}
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-brand-text">
                <input
                  type="radio"
                  name="finish"
                  value="gold-steel"
                  checked={finishFilter === 'gold-steel'}
                  onChange={() => setFinishFilter('gold-steel')}
                  className="accent-brand-gold"
                />
                {dict.product.goldSteel}
              </label>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-brand-text">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-brand-gold focus:ring-brand-gold accent-brand-gold w-4 h-4"
              />
              {dict.product.inStock}
            </label>
          </div>
        </div>

        {/* Mobile Filter Footer */}
        <div className="p-6 border-t border-brand-border lg:hidden bg-brand-bg">
          <button 
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full py-3 bg-brand-text text-brand-surface rounded-full text-sm font-medium"
          >
            {dict.nav.close}
          </button>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1">
        {filteredAndSorted.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} dict={dict} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg text-brand-muted mb-4">{dict.nav.noResults}</p>
            <button 
              onClick={() => { setFinishFilter('all'); setInStockOnly(false) }}
              className="px-6 py-2 border border-brand-border rounded-full text-sm font-medium hover:bg-brand-cream transition-colors"
            >
              {dict.nav.viewAll}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
