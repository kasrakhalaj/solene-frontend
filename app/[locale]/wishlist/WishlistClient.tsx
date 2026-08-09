'use client'

import { useStore } from '@/lib/cartStore'
import { selectIsAuthenticated, useAuthStore } from '@/lib/authStore'
import { catalogService } from '@/lib/catalogService'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { useLocale } from '@/app/[locale]/providers'
import Link from 'next/link'

interface WishlistClientProps {
  dict: Dictionary
}

export function WishlistClient({ dict }: WishlistClientProps) {
  const locale = useLocale()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const hasHydrated = useAuthStore((state) => state._hasHydrated)
  const wishlistIds = useStore((s) => s.wishlist)
  
  // Find the actual product objects for the IDs in the wishlist
  const wishlistedProducts = catalogService.getByIds(wishlistIds)

  if (!hasHydrated) return null

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-gold"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-medium text-brand-text mb-4">
          {dict.wishlistModal.title}
        </h2>
        <p className="text-brand-muted mb-8">
          {dict.wishlistModal.description}
        </p>
        <Link
          href={`/${locale}/login?redirect=/${locale}/wishlist`}
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-text text-brand-surface font-medium hover:opacity-90 transition-opacity"
        >
          {dict.wishlistModal.login}
        </Link>
      </div>
    )
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-gold"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-medium text-brand-text mb-4">
          {dict.wishlistPage.empty}
        </h2>
        <p className="text-brand-muted mb-8">
          {dict.wishlistPage.emptyDescription}
        </p>
        <Link
          href={`/${locale}/collections/rings`}
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-text text-brand-surface font-medium hover:opacity-90 transition-opacity"
        >
          {dict.wishlistPage.continueShopping}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
      {wishlistedProducts.map(product => (
        <ProductCard key={product.id} product={product} dict={dict} />
      ))}
    </div>
  )
}
