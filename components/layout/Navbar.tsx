'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Globe,
} from 'lucide-react'
import { useStore, cartCount } from '@/lib/cartStore'
import { useLocale } from '@/app/[locale]/providers'
import { siteConfig } from '@/lib/siteConfig'
import { cn } from '@/lib/utils'
import { CartDrawer } from './CartDrawer'
import { SearchDrawer } from './SearchDrawer'
import type { Dictionary } from '@/app/[locale]/dictionaries'

// ─── Category links ──────────────────────────────────────────────────────────

const NAV_CATEGORIES = ['rings', 'necklaces', 'earrings', 'bracelets'] as const

interface NavbarProps {
  dict: Dictionary
}

export function Navbar({ dict }: NavbarProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const isRtl = locale === 'fa'

  // ── Scroll glass effect ──
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    handler() // initial check
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // ── Mobile menu ──
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ── Search drawer ──
  const [isSearchOpen, setSearchOpen] = useState(false)

  // ── Cart ──
  const items = useStore((s) => s.items)
  const openCart = useStore((s) => s.openCart)
  const wishlist = useStore((s) => s.wishlist)
  const count = cartCount(items)

  // ── Language switch path ──
  const otherLocale = locale === 'fa' ? 'en' : 'fa'
  const switchLocalePath = (() => {
    const segments = pathname.split('/')
    segments[1] = otherLocale
    return segments.join('/')
  })()



  // ── Lock body scroll when mobile menu open ──
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-brand-text text-brand-surface text-xs sm:text-sm text-center py-2 px-4 leading-relaxed">
        {dict.announcement.text}
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          'sticky top-0 z-[var(--z-navbar)] transition-all duration-300',
          isScrolled
            ? 'glass shadow-sm'
            : 'bg-brand-surface',
        )}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
          aria-label={dict.nav.menu}
        >
          {/* ─── Left: Nav links (desktop) / Hamburger (mobile) ─── */}
          <div className="flex items-center gap-1">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-cream transition-colors"
              aria-label={dict.nav.menu}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/collections/${cat}`}
                  className={cn(
                    'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                    pathname.includes(`/collections/${cat}`)
                      ? 'bg-brand-cream text-brand-text'
                      : 'text-brand-muted hover:text-brand-text hover:bg-brand-cream/60',
                  )}
                >
                  {dict.nav[cat as keyof typeof dict.nav]}
                </Link>
              ))}
              <Link
                href={`/${locale}/about`}
                className={cn(
                  'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                  pathname.includes('/about')
                    ? 'bg-brand-cream text-brand-text'
                    : 'text-brand-muted hover:text-brand-text hover:bg-brand-cream/60',
                )}
              >
                {dict.nav.about}
              </Link>
            </div>
          </div>

          {/* ─── Center: Brand logo ─── */}
          <Link
            href={`/${locale}`}
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none select-none"
          >
            <span className="text-xl sm:text-2xl font-bold tracking-wider text-brand-text">
              {siteConfig.brandLatin}
            </span>
            <span className="text-[10px] sm:text-xs text-brand-muted tracking-widest mt-0.5">
              {isRtl ? siteConfig.brandFa : siteConfig.taglineEn}
            </span>
          </Link>

          {/* ─── Right: Actions ─── */}
          <div className="flex items-center gap-0.5">
            {/* Language switcher (desktop) */}
            <Link
              href={switchLocalePath}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-brand-muted hover:text-brand-text hover:bg-brand-cream/60 transition-colors"
            >
              <Globe size={16} />
              <span>{dict.common.languageSwitcher}</span>
            </Link>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-cream transition-colors text-brand-muted hover:text-brand-text"
              aria-label={dict.nav.search}
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href={`/${locale}/wishlist`}
              className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-cream transition-colors text-brand-muted hover:text-brand-text relative"
              aria-label={dict.nav.wishlist}
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-brand-gold" />
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-cream transition-colors text-brand-muted hover:text-brand-text relative"
              aria-label={`${dict.nav.cart} (${count})`}
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -end-0.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-brand-gold text-white text-[11px] font-bold leading-none"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* ─── Mobile menu panel ─── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-brand-border bg-brand-surface"
            >
              <div className="px-5 py-4 space-y-1">
                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/${locale}/collections/${cat}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      pathname.includes(`/collections/${cat}`)
                        ? 'bg-brand-cream text-brand-text'
                        : 'text-brand-muted hover:bg-brand-cream/60',
                    )}
                  >
                    {dict.nav[cat as keyof typeof dict.nav]}
                  </Link>
                ))}
                <Link
                  href={`/${locale}/about`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    pathname.includes('/about')
                      ? 'bg-brand-cream text-brand-text'
                      : 'text-brand-muted hover:bg-brand-cream/60',
                  )}
                >
                  {dict.nav.about}
                </Link>

                {/* Language switcher (mobile) */}
                <div className="pt-2 border-t border-brand-border mt-2">
                  <Link
                    href={switchLocalePath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-brand-muted hover:bg-brand-cream/60 transition-colors"
                  >
                    <Globe size={18} />
                    {dict.common.languageSwitcher}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Drawers ─── */}
      <SearchDrawer
        dict={dict}
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
      />
      <CartDrawer dict={dict} />
    </>
  )
}
