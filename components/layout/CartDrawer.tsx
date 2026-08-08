'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useStore, cartTotal } from '@/lib/cartStore'
import { useLocale } from '@/app/[locale]/providers'
import { siteConfig } from '@/lib/siteConfig'
import { formatPrice } from '@/lib/utils'
import type { Dictionary } from '@/app/[locale]/dictionaries'

interface CartDrawerProps {
  dict: Dictionary
}

export function CartDrawer({ dict }: CartDrawerProps) {
  const locale = useLocale()
  const isRtl = locale === 'fa'
  const items = useStore((s) => s.items)
  const isOpen = useStore((s) => s.isCartOpen)
  const closeCart = useStore((s) => s.closeCart)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const updateQuantity = useStore((s) => s.updateQuantity)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const total = cartTotal(items)
  const threshold = siteConfig.freeShippingThreshold
  const remaining = Math.max(threshold - total, 0)
  const progress = Math.min(total / threshold, 1)

  // Save trigger element on open, restore focus on close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      triggerRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus trap + Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeCart(); return }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
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
    [closeCart],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    // Auto-focus close button
    const firstBtn = drawerRef.current?.querySelector<HTMLElement>('button')
    firstBtn?.focus()
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
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.cart.title}
            className={[
              'fixed top-0 bottom-0 z-[var(--z-drawer)] w-full max-w-md',
              'bg-brand-surface flex flex-col shadow-2xl',
              isRtl ? 'left-0' : 'right-0',
            ].join(' ')}
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="text-lg font-semibold text-brand-text">
                {dict.cart.title}
              </h2>
              <button
                onClick={closeCart}
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-cream transition-colors"
                aria-label={dict.nav.close}
              >
                <X size={20} />
              </button>
            </div>

            {/* Free shipping progress */}
            {items.length > 0 && (
              <div className="px-5 py-3 border-b border-brand-border">
                {remaining > 0 ? (
                  <p className="text-sm text-brand-muted mb-2">
                    {dict.cart.freeShippingProgress.replace(
                      '{amount}',
                      formatPrice(remaining, locale).replace(
                        locale === 'fa' ? ' تومان' : ' Toman',
                        '',
                      ),
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-brand-gold font-medium">
                    {dict.cart.freeShippingReached}
                  </p>
                )}
                <div className="h-1.5 rounded-full bg-brand-cream overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-brand-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-brand-border" />
                  <p className="font-medium text-brand-text">
                    {dict.cart.empty}
                  </p>
                  <p className="text-sm text-brand-muted">
                    {dict.cart.emptyDescription}
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-6 py-3 rounded-full bg-brand-text text-brand-surface text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {dict.cart.continueShopping}
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const title =
                    locale === 'fa' ? item.product.title_fa : item.product.title_en
                  return (
                    <div
                      key={`${item.product.id}::${item.size}`}
                      className="flex gap-3"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-brand-cream shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-text truncate">
                          {title}
                        </p>
                        {item.size && (
                          <p className="text-xs text-brand-muted mt-0.5">
                            {dict.product.selectSize}: {item.size}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-brand-gold mt-1">
                          {formatPrice(item.product.price, locale)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-border hover:bg-brand-cream transition-colors"
                            aria-label={`${dict.cart.quantity} -1`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-border hover:bg-brand-cream transition-colors"
                            aria-label={`${dict.cart.quantity} +1`}
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.size)
                            }
                            className="ms-auto w-8 h-8 flex items-center justify-center rounded-full text-brand-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label={dict.cart.remove}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer — subtotal + checkout */}
            {items.length > 0 && (
              <div className="border-t border-brand-border px-5 py-4 space-y-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>{dict.cart.subtotal}</span>
                  <span className="text-brand-gold">
                    {formatPrice(total, locale)}
                  </span>
                </div>
                <Link
                  href={`/${locale}/checkout`}
                  onClick={closeCart}
                  className="block w-full text-center py-3.5 rounded-full bg-brand-text text-brand-surface font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  {dict.cart.checkout}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
