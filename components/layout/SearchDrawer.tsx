'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { X, Search as SearchIcon } from 'lucide-react'
import { products } from '@/lib/mockData'
import { useLocale } from '@/app/[locale]/providers'
import { formatPrice } from '@/lib/utils'
import type { Dictionary } from '@/app/[locale]/dictionaries'

interface SearchDrawerProps {
  dict: Dictionary
  isOpen: boolean
  onClose: () => void
}

export function SearchDrawer({ dict, isOpen, onClose }: SearchDrawerProps) {
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Filter products by locale-aware title + description
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length === 0) return []
    return products.filter((p) => {
      const title = locale === 'fa' ? p.title_fa : p.title_en
      const desc = locale === 'fa' ? p.description_fa : p.description_en
      return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
    })
  }, [query, locale])

  // Wrap onClose to also reset the query state
  const handleClose = useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  // Lock body scroll and manage focus on open/close (DOM-only side effects)
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

  // Escape key + focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handleClose(); return }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    },
    [handleClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

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

          {/* Search panel — slides down from top */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.search}
            className="fixed top-0 inset-x-0 z-[var(--z-drawer)] bg-brand-surface shadow-2xl max-h-[85vh] flex flex-col"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-border">
              <SearchIcon size={20} className="text-brand-muted shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.nav.searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-brand-text placeholder:text-brand-muted text-base"
                autoComplete="off"
              />
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-cream transition-colors shrink-0"
                aria-label={dict.nav.close}
              >
                <X size={20} />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {query.trim().length > 0 && results.length === 0 && (
                <p className="text-center text-brand-muted py-8">
                  {dict.nav.noResults}
                </p>
              )}

              {results.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.slice(0, 8).map((product) => {
                    const title =
                      locale === 'fa' ? product.title_fa : product.title_en
                    return (
                      <Link
                        key={product.id}
                        href={`/${locale}/products/${product.slug}`}
                        onClick={handleClose}
                        className="group flex flex-col gap-2"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-brand-cream">
                          <Image
                            src={product.images[0]}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-sm font-medium text-brand-text truncate">
                          {title}
                        </p>
                        <p className="text-sm text-brand-gold font-semibold">
                          {formatPrice(product.price, locale)}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
