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
export function Providers({ children, locale }: ProvidersProps) {
  return (
    <LocaleProvider locale={locale}>
      {children}
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
