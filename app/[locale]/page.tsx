import Image from 'next/image'
import Link from 'next/link'
import { getDictionary } from './dictionaries'
import { catalogService } from '@/lib/catalogService'
import { ProductCard } from '@/components/ui/ProductCard'
import { TrustBadgeRow } from '@/components/ui/TrustBadgeRow'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/metadata'
import type { SupportedLocale } from '@/lib/siteConfig'

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary()
  return {
    title: dict.metadata.home.title,
    description: dict.metadata.home.description,
    alternates: localeAlternates(),
  }
}

export default async function LocalePage(props: { params: Promise<{ locale: SupportedLocale }> }) {
  const params = await props.params;
  const locale = params.locale
  const dict = await getDictionary()
  
  const bestSellers = catalogService.getBestSellers()
  const categories = catalogService.getCategories()

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate w-full min-h-[calc(100svh-7rem)] overflow-hidden bg-brand-bg lg:min-h-[720px]">
        <div aria-hidden="true" className="absolute -start-24 top-8 h-72 w-72 rounded-full bg-brand-gold/8 blur-3xl" />
        <div aria-hidden="true" className="absolute -end-20 bottom-0 h-80 w-80 rounded-full bg-white/80 blur-3xl" />
        <div className="relative mx-auto grid min-h-[inherit] w-full max-w-[1600px] lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        {/* Text Content */}
        <div className="z-10 flex flex-col justify-center px-6 pb-10 pt-14 sm:px-10 lg:px-16 lg:py-24 xl:px-24">
          <div className="max-w-xl">
            <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
              <span aria-hidden="true" className="h-px w-9 bg-brand-gold" />
              <span>{dict.common.tagline}</span>
            </div>
            <h1 className="mb-6 text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-brand-text sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              {dict.home.heroTitle}
            </h1>
            <p className="mb-9 max-w-lg text-base leading-relaxed text-brand-muted sm:text-lg lg:text-xl">
              {dict.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/${locale}/collections/rings`}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand-text px-8 py-3.5 text-sm font-medium text-brand-surface shadow-[0_12px_30px_rgba(26,26,26,0.12)] hover:-translate-y-0.5 hover:bg-brand-gold focus-visible:outline-offset-4 sm:text-base"
              >
                {dict.home.explore}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative min-h-[52svh] px-4 pb-5 sm:px-8 lg:min-h-full lg:px-0 lg:py-8 lg:pe-8 xl:pe-12">
          <div className="relative h-full min-h-[inherit] overflow-hidden rounded-[2rem] bg-brand-cream shadow-[0_30px_80px_rgba(69,55,35,0.12)] lg:min-h-0">
            <Image
              src="/images/solene-hero.webp"
              alt={dict.home.heroImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.015]"
              priority
            />
            <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-black/5" />
          </div>
        </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-brand-bg overflow-hidden">
        <TrustBadgeRow dict={dict} className="border-none !my-0 py-8 lg:py-10" />
      </section>

      {/* Featured Collections */}
      <section id="collections" className="scroll-mt-24 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex items-end justify-between lg:mb-12">
          <div>
            <div aria-hidden="true" className="mb-5 h-px w-10 bg-brand-gold" />
            <h2 className="text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">{dict.nav.collections}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.key} 
              href={`/${locale}/collections/${cat.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-brand-cream shadow-[0_12px_32px_rgba(69,55,35,0.06)]"
            >
              <Image
                src={`/images/category-${cat.key}.webp`}
                alt={dict.nav[cat.key]}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent transition-colors group-hover:from-black/65" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                <h3 className="text-base font-medium tracking-wide text-white sm:text-xl">
                  {dict.nav[cat.key]}
                </h3>
                <div aria-hidden="true" className="mt-2 h-px w-0 bg-white/80 transition-all duration-500 group-hover:w-10" />
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-brand-cream/40 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex items-end justify-between lg:mb-12">
          <div>
            <div aria-hidden="true" className="mb-5 h-px w-10 bg-brand-gold" />
            <h2 className="text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">{dict.product.bestSeller}</h2>
          </div>
          <Link 
            href={`/${locale}/collections/rings`}
            className="border-b border-brand-gold/40 pb-1 text-sm font-medium text-brand-gold hover:border-brand-text hover:text-brand-text"
          >
            {dict.nav.viewAll}
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} dict={dict} />
          ))}
        </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-brand-border/70 bg-white px-7 py-14 text-center shadow-[0_24px_70px_rgba(69,55,35,0.06)] sm:px-14 lg:px-20 lg:py-20">
        <div aria-hidden="true" className="mx-auto mb-7 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-brand-gold/70" />
          <span className="h-1.5 w-1.5 rotate-45 bg-brand-gold" />
          <span className="h-px w-8 bg-brand-gold/70" />
        </div>
        <h2 className="mb-6 text-3xl font-semibold tracking-tight text-brand-text sm:text-4xl">
          {dict.home.brandStoryTitle}
        </h2>
        <p className="text-base leading-relaxed text-brand-muted sm:text-lg">
          {dict.home.brandStoryText}
        </p>
        </div>
      </section>
    </main>
  )
}
