/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { X, Search as SearchIcon, ArrowRight, ArrowLeft } from 'lucide-react'
import { searchService, type SearchResult } from '@/lib/searchService'
import { useLocale } from '@/app/[locale]/providers'
import { formatPrice } from '@/lib/utils'
import type { Dictionary } from '@/app/[locale]/dictionaries'

interface SearchDrawerProps {
  dict: Dictionary
  isOpen: boolean
  onClose: () => void
}

const TRENDING_FA = ['انگشتر', 'گردنبند', 'گوشواره', 'دستبند', 'استیل طلایی']
const TRENDING_EN = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Gold-tone steel']

export function SearchDrawer({ dict, isOpen, onClose }: SearchDrawerProps) {
  const locale = useLocale()
  const router = useRouter()
  
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // 1. Fetch results from abstract service
  const results = useMemo<SearchResult[]>(() => {
    return searchService.search(query, locale)
  }, [query, locale])

  // 2. Fetch featured products for zero-state
  const featured = useMemo(() => {
    return searchService.getFeatured(3)
  }, [])

  const trending = locale === 'fa' ? TRENDING_FA : TRENDING_EN
  const isRtl = locale === 'fa'

  // Reset state when closing
  const handleClose = useCallback(() => {
    setQuery('')
    setActiveIndex(-1)
    onClose()
  }, [onClose])

  const submitSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return
    router.push(`/${locale}/search?q=${encodeURIComponent(searchTerm.trim())}`)
    handleClose()
  }, [router, locale, handleClose])

  // Lock body scroll and manage focus on open/close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      const t = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(t)
    } else {
      document.body.style.overflow = ''
      triggerRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Keyboard navigation & Esc handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') { 
        handleClose()
        return 
      }
      
      const isInputFocused = document.activeElement === inputRef.current

      // Navigate results if we have them
      if (results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveIndex(prev => (prev > -1 ? prev - 1 : -1))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (activeIndex >= 0 && activeIndex < results.length) {
            // Navigate to specific product
            const p = results[activeIndex].product
            router.push(`/${locale}/products/${p.slug}`)
            handleClose()
          } else {
            // Submit entire query
            submitSearch(query)
          }
        }
      } else if (e.key === 'Enter') {
        // No results or zero state, just submit the query string
        submitSearch(query)
      }
      
      // Auto-populate input if navigating down into a result? 
      // The PRD mentions populating suggestions, but we are skipping complex 
      // autocomplete suggestions (text-only) in favor of the direct product list.
    },
    [handleClose, results, activeIndex, router, locale, query, submitSearch],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  // Reset active index when query changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(-1)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[var(--z-drawer)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Search panel — full screen on mobile, drawer on desktop */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={(dict.search as any)?.placeholder || dict.nav.searchPlaceholder}
            className="fixed top-0 inset-x-0 z-[var(--z-drawer)] bg-brand-surface shadow-2xl h-[100dvh] md:h-auto md:max-h-[85vh] flex flex-col"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 md:px-6 py-4 md:py-6 border-b border-brand-border sticky top-0 bg-brand-surface z-10">
              <SearchIcon size={22} className="text-brand-muted shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={(dict.search as any)?.placeholder || dict.nav.searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-brand-text placeholder:text-brand-muted text-lg md:text-xl"
                autoComplete="off"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results-listbox"
                aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
              />
              
              {/* Separate Clear Button */}
              {query.length > 0 && (
                <button
                  onClick={() => { setQuery(''); inputRef.current?.focus() }}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-brand-cream text-brand-muted hover:text-brand-text transition-colors shrink-0"
                  aria-label={(dict.search as any)?.clear || "Clear search"}
                >
                  <X size={18} />
                </button>
              )}

              {/* Close Drawer Button */}
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-cream transition-colors shrink-0 ms-2"
                aria-label={(dict.search as any)?.close || dict.nav.close}
              >
                {isRtl ? <ArrowRight size={22} className="md:hidden" /> : <ArrowLeft size={22} className="md:hidden" />}
                <X size={24} className="hidden md:block" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              
              {/* ZERO STATE */}
              {query.trim().length === 0 && (
                <div className="p-6 md:p-10 max-w-2xl mx-auto w-full flex flex-col gap-10">
                  {/* Trending */}
                  <section>
                    <h3 className="text-xs font-semibold tracking-wider text-brand-muted uppercase mb-4">
                      {(dict.search as any)?.trending || 'TRENDING'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((term) => (
                        <button
                          key={term}
                          onClick={() => submitSearch(term)}
                          className="px-4 py-2 rounded-full border border-brand-border text-sm hover:border-brand-text hover:bg-brand-text hover:text-brand-surface transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Popular / Featured */}
                  <section>
                    <h3 className="text-xs font-semibold tracking-wider text-brand-muted uppercase mb-4">
                      {(dict.search as any)?.popular || 'POPULAR'}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {featured.map((product) => {
                        const title = locale === 'fa' ? product.title_fa : product.title_en
                        return (
                          <Link
                            key={product.id}
                            href={`/${locale}/products/${product.slug}`}
                            onClick={handleClose}
                            className="flex items-center gap-4 group p-2 -mx-2 rounded-lg hover:bg-brand-cream transition-colors"
                          >
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-brand-cream shrink-0">
                              <Image
                                src={product.images[0]}
                                alt={title}
                                fill
                                sizes="64px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-medium text-brand-text truncate">{title}</p>
                              <p className="text-sm text-brand-gold mt-0.5">{formatPrice(product.price, locale)}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                </div>
              )}

              {/* ACTIVE SEARCH STATE */}
              {query.trim().length > 0 && (
                <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
                  {results.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center gap-2">
                      <p className="text-xl font-medium text-brand-text">
                        {(dict.search as any)?.noResults?.title || 'Nothing matched your search'}
                      </p>
                      <p className="text-brand-muted">
                        {(dict.search as any)?.noResults?.description || 'Try a shorter or different search term.'}
                      </p>
                    </div>
                  ) : (
                    <ul role="listbox" id="search-results-listbox" className="flex flex-col gap-2">
                      {results.slice(0, 5).map(({ product }, idx) => {
                        const title = locale === 'fa' ? product.title_fa : product.title_en
                        const isActive = idx === activeIndex
                        return (
                          <li key={product.id} role="option" aria-selected={isActive} id={`search-result-${idx}`}>
                            <Link
                              href={`/${locale}/products/${product.slug}`}
                              onClick={handleClose}
                              className={`flex items-center gap-4 group p-3 rounded-lg transition-colors ${isActive ? 'bg-brand-cream' : 'hover:bg-brand-cream'}`}
                            >
                              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-brand-cream shrink-0">
                                <Image
                                  src={product.images[0]}
                                  alt={title}
                                  fill
                                  sizes="56px"
                                  className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base font-medium text-brand-text truncate">{title}</p>
                                <p className="text-sm text-brand-gold mt-0.5">{formatPrice(product.price, locale)}</p>
                              </div>
                            </Link>
                          </li>
                        )
                      })}
                      
                      {results.length > 0 && (
                        <li className="mt-4 border-t border-brand-border pt-4">
                          <button
                            onClick={() => submitSearch(query)}
                            className="w-full text-center py-3 text-sm font-medium text-brand-text hover:text-brand-gold transition-colors flex items-center justify-center gap-2"
                          >
                            {(dict.search as any)?.viewAll || 'View all results →'}
                            {!isRtl && <ArrowRight size={16} />}
                            {isRtl && <ArrowLeft size={16} />}
                          </button>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
