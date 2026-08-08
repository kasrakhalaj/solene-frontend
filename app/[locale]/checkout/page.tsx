import { getDictionary } from '@/app/[locale]/dictionaries'
import { CheckoutClient } from './CheckoutClient'

interface CheckoutPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function CheckoutPage(props: CheckoutPageProps) {
  const dict = await getDictionary()

  return (
    <main className="min-h-screen py-12 lg:py-20 px-4 lg:px-16 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl lg:text-4xl font-semibold text-brand-text mb-10">
        {dict.checkout.title}
      </h1>
      <CheckoutClient dict={dict} />
    </main>
  )
}
