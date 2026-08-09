'use client'

import { selectIsAuthenticated, useAuthStore } from '@/lib/authStore'
import { useLocale } from '@/app/[locale]/providers'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import Link from 'next/link'
import { Heart, Package, UserCircle, LogOut } from 'lucide-react'

interface AccountClientProps {
  dict: Dictionary
}

export function AccountClient({ dict }: AccountClientProps) {
  const locale = useLocale()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const hasHydrated = useAuthStore((state) => state._hasHydrated)
  const logout = useAuthStore((state) => state.logout)

  if (!hasHydrated) return null

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center mb-6">
          <UserCircle size={32} className="text-brand-gold" />
        </div>
        <h2 className="text-2xl font-medium text-brand-text mb-4">
          {dict.auth.loginTitle}
        </h2>
        <p className="text-brand-muted mb-8">
          {dict.auth.loginDescription}
        </p>
        <Link
          href={`/${locale}/login?redirect=/${locale}/account`}
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-text text-brand-surface font-medium hover:opacity-90 transition-opacity"
        >
          {dict.nav.login || dict.auth.loginTitle}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 shadow-sm text-center sm:text-start">
          <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mb-4 mx-auto sm:mx-0">
            <span className="text-xl font-medium text-brand-gold">
              {(user.displayName || user.email || user.phone || 'U')[0].toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-brand-text mb-1">
            {dict.account.welcome} {user.displayName || ''}
          </h2>
          <p className="text-brand-muted" dir="ltr">{user.phone || user.email}</p>
          
          <div className="mt-8 pt-6 border-t border-brand-border space-y-2">
            <Link 
              href={`/${locale}/wishlist`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-cream transition-colors text-brand-text font-medium"
            >
              <Heart size={20} className="text-brand-muted" />
              {dict.account.wishlist}
            </Link>
            <button 
              onClick={() => logout()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 font-medium w-full text-start"
            >
              <LogOut size={20} />
              {dict.account.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-8 space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-brand-text mb-6 flex items-center gap-2">
            <Package className="text-brand-gold" />
            {dict.account.orders}
          </h3>
          <div className="bg-brand-surface border border-brand-border rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mb-4 mx-auto">
              <Package size={24} className="text-brand-muted" />
            </div>
            <p className="text-brand-text font-medium mb-2">{dict.account.noOrders}</p>
            <p className="text-sm text-brand-muted mb-6">
              {dict.account.ordersDescription}
            </p>
            <Link 
              href={`/${locale}/collections/rings`}
              className="inline-flex h-10 items-center justify-center px-6 rounded-full border border-brand-text text-brand-text font-medium hover:bg-brand-text hover:text-brand-surface transition-colors"
            >
              {dict.account.startShopping}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
