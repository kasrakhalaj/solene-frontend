import { getDictionary } from '@/app/[locale]/dictionaries'
import { searchService } from '@/lib/searchService'
import { ProductCard } from '@/components/ui/ProductCard'
import Link from 'next/link'
import type { SupportedLocale } from '@/lib/siteConfig'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary()
  return {
    ...dict.metadata.search,
    alternates: localeAlternates('/search'),
  }
}

interface SearchPageProps {
  params: Promise<{ locale: SupportedLocale }>
  searchParams: Promise<{ q?: string | string[] }>
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const [{ locale }, queryParams] = await Promise.all([params, searchParams])
  const dict = await getDictionary()
  const rawQuery = queryParams.q
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery) ?? ''
  
  const results = searchService.search(query, locale)
  const resultsTitle = dict.search.resultsTitle.replace('{query}', query)
  const resultsCount = dict.search.resultsCount.replace('{count}', results.length.toString())

  return (
    <main className="min-h-screen py-12 lg:py-20 px-4 lg:px-16 max-w-7xl mx-auto w-full">
      <div className="mb-10 text-center lg:text-start">
        <h1 className="text-3xl lg:text-4xl font-semibold text-brand-text mb-2">
          {query ? resultsTitle : dict.search.placeholder}
        </h1>
        {query && (
          <p className="text-brand-muted text-sm md:text-base">
            {resultsCount}
          </p>
        )}
      </div>

      {results.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-brand-cream/50 rounded-2xl">
          <p className="text-2xl font-medium text-brand-text">
            {dict.search.noResults.title}
          </p>
          <p className="text-brand-muted">
            {dict.search.noResults.description}
          </p>
          <Link
            href={`/${locale}/collections/rings`}
            className="mt-6 px-8 py-3 bg-brand-gold text-brand-surface font-medium rounded-full hover:bg-brand-gold/90 transition-colors"
          >
            {dict.nav?.shopNow || 'Shop Now'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {results.map(({ product }) => (
            <ProductCard key={product.id} product={product} dict={dict} />
          ))}
        </div>
      )}
    </main>
  )
}
