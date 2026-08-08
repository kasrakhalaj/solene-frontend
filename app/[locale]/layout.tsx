import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Inter, Vazirmatn } from 'next/font/google'
import { locale as getLocale } from 'next/root-params'
import { hasLocale, getDictionary } from './dictionaries'
import { siteConfig } from '../../lib/siteConfig'
import { Providers } from './providers'
import '../globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────
// next/font/google self-hosts all fonts at build time — no render-blocking
// Google Fonts <link> tags are ever emitted.

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return siteConfig.locales.map((l) => ({ locale: l }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const l = await getLocale()
  if (!hasLocale(l)) return {}
  const dict = await getDictionary()
  return {
    title: dict.metadata.home.title,
    description: dict.metadata.home.description,
    metadataBase: new URL('https://solene.store'),
    alternates: {
      languages: {
        fa: '/fa',
        en: '/en',
      },
    },
  }
}

// ─── Root layout ───────────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const l = await getLocale()
  if (!hasLocale(l)) notFound()

  const isFa = l === 'fa'
  const dir = isFa ? 'rtl' : 'ltr'

  return (
    <html
      lang={l}
      dir={dir}
      className={`${inter.variable} ${vazirmatn.variable} h-full`}
    >
      <body
        className={[
          'min-h-full flex flex-col antialiased',
          'bg-brand-bg text-brand-text',
          isFa ? 'font-vazirmatn' : 'font-inter',
        ].join(' ')}
      >
        <Providers locale={l}>{children}</Providers>
      </body>
    </html>
  )
}
