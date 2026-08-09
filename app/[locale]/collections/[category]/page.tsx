import { notFound } from 'next/navigation'
import { getDictionary } from '@/app/[locale]/dictionaries'
import { catalogService } from '@/lib/catalogService'
import { CollectionClient } from './CollectionClient'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/metadata'

interface CollectionPageProps {
  params: Promise<{
    locale: string
    category: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'fa']
  const paths: { locale: string; category: string }[] = []
  const categories = catalogService.getCategories()
  
  for (const locale of locales) {
    for (const cat of categories) {
      paths.push({ locale, category: cat.slug })
    }
  }
  
  return paths
}

export async function generateMetadata(props: CollectionPageProps): Promise<Metadata> {
  const { category } = await props.params
  const dict = await getDictionary()
  return {
    ...dict.metadata.collections,
    alternates: localeAlternates(`/collections/${category}`),
  }
}

export default async function CollectionPage(props: CollectionPageProps) {
  const params = await props.params;
  const categorySlug = params.category;
  
  const category = catalogService.getCategories().find(c => c.slug === categorySlug)
  if (!category) {
    notFound()
  }

  const dict = await getDictionary()
  const products = catalogService.getByCategory(category.key)
  const categoryName = dict.nav[category.key]

  return (
    <main className="min-h-screen py-12 lg:py-20 px-4 lg:px-16 max-w-[1600px] mx-auto w-full">
      <div className="mb-10 lg:mb-16">
        <h1 className="text-3xl lg:text-5xl font-semibold text-brand-text mb-4">
          {categoryName}
        </h1>
        <p className="text-brand-muted text-lg">
          {dict.product.productCount.replace('{count}', String(products.length))}
        </p>
      </div>

      <CollectionClient 
        initialProducts={products} 
        dict={dict} 
      />
    </main>
  )
}
