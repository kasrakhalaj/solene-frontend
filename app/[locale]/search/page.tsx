/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDictionary } from '@/app/[locale]/dictionaries'
import { searchService } from '@/lib/searchService'
import { ProductCard } from '@/components/ui/ProductCard'
import Link from 'next/link'

export default async function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: 'en' | 'fa' }
  searchParams: { q?: string }
}) {
  const dict = await getDictionary()
  const query = searchParams.q || ''
  
  const results = searchService.search(query, locale)

  // Use the search dictionary if it exists, fallback to standard keys
  const searchDict = (dict as any).search || {}
  
  const resultsTitle = searchDict.resultsTitle 
    ? searchDict.resultsTitle.replace('{query}', query)
    : `Search results for "${query}"`
    
  const resultsCount = searchDict.resultsCount
    ? searchDict.resultsCount.replace('{count}', results.length.toString())
    : `${results.length} products found`

  return (
    <main className="min-h-screen py-12 lg:py-20 px-4 lg:px-16 max-w-7xl mx-auto w-full">
      <div className="mb-10 text-center lg:text-start">
        <h1 className="text-3xl lg:text-4xl font-semibold text-brand-text mb-2">
          {query ? resultsTitle : (searchDict.placeholder || 'Search')}
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
            {searchDict.noResults?.title || 'Nothing matched your search'}
          </p>
          <p className="text-brand-muted">
            {searchDict.noResults?.description || 'Try a shorter or different search term.'}
          </p>
          <Link
            href={`/${locale}/collections`}
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
