import { notFound } from 'next/navigation'
import { getDictionary } from '@/app/[locale]/dictionaries'
import { getProductBySlug, products } from '@/lib/mockData'
import { ProductClient } from './ProductClient'

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
    for (const p of products) {
      paths.push({ locale, slug: p.slug })
    }
  }
  
  return paths
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const slug = params.slug;
  
  const product = getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  const dict = await getDictionary()

  return (
    <main className="min-h-screen py-12 px-4 lg:px-16 w-full">
      <ProductClient product={product} dict={dict} />
    </main>
  )
}
