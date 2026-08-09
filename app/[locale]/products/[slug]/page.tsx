import { notFound } from 'next/navigation'
import { getDictionary } from '@/app/[locale]/dictionaries'
import { catalogService } from '@/lib/catalogService'
import { ProductClient } from './ProductClient'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/metadata'

interface ProductPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'fa']
  const paths: { locale: string; slug: string }[] = []
  
  for (const locale of locales) {
    for (const p of catalogService.getAll()) {
      paths.push({ locale, slug: p.slug })
    }
  }
  
  return paths
}

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await props.params
  const product = catalogService.getBySlug(slug)
  if (!product) return {}

  const isFa = locale === 'fa'
  return {
    title: isFa ? product.title_fa : product.title_en,
    description: isFa ? product.description_fa : product.description_en,
    alternates: localeAlternates(`/products/${slug}`),
  }
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const slug = params.slug;
  
  const product = catalogService.getBySlug(slug)
  if (!product) {
    notFound()
  }

  const dict = await getDictionary()
  const relatedProducts = catalogService
    .getByCategory(product.category)
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, 4)

  return (
    <main className="min-h-screen py-12 px-4 lg:px-16 w-full">
      <ProductClient product={product} relatedProducts={relatedProducts} dict={dict} />
    </main>
  )
}
