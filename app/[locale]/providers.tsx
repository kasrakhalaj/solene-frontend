'use client'

import { type ReactNode } from 'react'
import type { SupportedLocale } from '../../lib/siteConfig'

interface ProvidersProps {
  children: ReactNode
  locale: SupportedLocale
}

/**
 * Client-side provider tree.
 * Cart and wishlist state (Zustand) are initialized here.
 * Locale is passed down via a simple context for client components.
 *
 * Deliberately thin: Server Components read locale via next/root-params;
 * only client components need this context.
 */
import { WishlistProvider } from '@/components/providers/WishlistProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'
import type { Dictionary } from './dictionaries'

export function Providers({ children, locale, dict }: ProvidersProps & { dict: Dictionary }) {
  return (
    <LocaleProvider locale={locale}>
      <WishlistProvider dict={dict}>
        {children}
        <ToastProvider />
      </WishlistProvider>
    </LocaleProvider>
  )
}

// ─── Locale context ─────────────────────────────────────────────────────────

import { createContext, useContext } from 'react'

const LocaleContext = createContext<SupportedLocale>('fa')

function LocaleProvider({
  children,
  locale,
}: {
  children: ReactNode
  locale: SupportedLocale
}) {
  return (
    <LocaleContext.Provider value={locale}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): SupportedLocale {
  return useContext(LocaleContext)
}
