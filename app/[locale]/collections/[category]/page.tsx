import { notFound } from 'next/navigation'
import { getDictionary } from '@/app/[locale]/dictionaries'
import { getProductsByCategory, categories, ProductCategory } from '@/lib/mockData'
import { CollectionClient } from './CollectionClient'

interface CollectionPageProps {
  params: Promise<{
    locale: string
    category: string
  }>
}

export async function generateStaticParams() {
  const locales = ['en', 'fa']
  const paths: { locale: string; category: string }[] = []
  
  for (const locale of locales) {
    for (const cat of categories) {
      paths.push({ locale, category: cat.slug })
    }
  }
  
  return paths
}

export default async function CollectionPage(props: CollectionPageProps) {
  const params = await props.params;
  const categorySlug = params.category;
  
  const category = categories.find(c => c.slug === categorySlug)
  if (!category) {
    notFound()
  }

  const dict = await getDictionary()
  const products = getProductsByCategory(category.key as ProductCategory)
  const categoryName = dict.nav[category.key as keyof typeof dict.nav]

  return (
    <main className="min-h-screen py-12 lg:py-20 px-4 lg:px-16 max-w-[1600px] mx-auto w-full">
      <div className="mb-10 lg:mb-16">
        <h1 className="text-3xl lg:text-5xl font-semibold text-brand-text mb-4">
          {categoryName}
        </h1>
        <p className="text-brand-muted text-lg">
          {products.length} {dict.product.relatedProducts.split(' ')[0]}
        </p>
      </div>

      <CollectionClient 
        initialProducts={products} 
        dict={dict} 
      />
    </main>
  )
}
