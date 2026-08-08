import Image from 'next/image'
import Link from 'next/link'
import { getDictionary } from './dictionaries'
import { getBestSellers, categories } from '../../lib/mockData'
import { ProductCard } from '@/components/ui/ProductCard'
import { TrustBadgeRow } from '@/components/ui/TrustBadgeRow'

export default async function LocalePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = params.locale as 'en' | 'fa';
  const dict = await getDictionary()
  
  const bestSellers = getBestSellers()

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row items-stretch bg-brand-bg">
        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-24 z-10">
          <div className="max-w-xl">
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-brand-text mb-6 leading-tight">
              {dict.home.heroTitle}
            </h1>
            <p className="text-lg lg:text-xl text-brand-muted mb-8 leading-relaxed">
              {dict.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/${locale}/collections/rings`}
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-text text-brand-surface rounded-full text-base font-medium hover:opacity-90 transition-opacity"
              >
                {dict.home.explore}
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative min-h-[50vh] lg:min-h-full">
          <div className="absolute inset-4 lg:inset-y-8 lg:inset-e-8 rounded-3xl overflow-hidden bg-brand-cream">
            <Image
              src="https://picsum.photos/seed/solenehero/1200/1600"
              alt="Solene hero jewelry"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-brand-bg overflow-hidden">
        <TrustBadgeRow dict={dict} className="border-none !my-0 py-8 lg:py-10" />
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-6 lg:px-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-brand-text">{dict.nav.collections}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.key} 
              href={`/${locale}/collections/${cat.slug}`}
              className="group block relative aspect-square rounded-2xl overflow-hidden bg-brand-cream"
            >
              <Image
                src={`https://picsum.photos/seed/solenecat${cat.key}/600/600`}
                alt={dict.nav[cat.key as keyof typeof dict.nav]}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-medium tracking-wide">
                  {dict.nav[cat.key as keyof typeof dict.nav]}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-6 lg:px-16 bg-brand-cream/30">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-brand-text">{dict.product.bestSeller}</h2>
          <Link 
            href={`/${locale}/collections/rings`}
            className="text-sm font-medium text-brand-gold hover:text-brand-text transition-colors"
          >
            {dict.nav.viewAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} dict={dict} />
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-6 lg:px-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-brand-text mb-6">
          {dict.home.brandStoryTitle}
        </h2>
        <p className="text-lg text-brand-muted leading-relaxed">
          {dict.home.brandStoryText}
        </p>
      </section>
    </main>
  )
}
