import { getDictionary } from '@/app/[locale]/dictionaries'
import { AccountClient } from './AccountClient'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary()
  return {
    ...dict.metadata.account,
    alternates: localeAlternates('/account'),
  }
}

export default async function AccountPage() {
  const dict = await getDictionary()

  return (
    <main className="min-h-screen py-12 lg:py-20 px-4 lg:px-16 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl lg:text-4xl font-semibold text-brand-text mb-10">
        {dict.account.title}
      </h1>
      <AccountClient dict={dict} />
    </main>
  )
}
