import { locale } from 'next/root-params'
import { notFound } from 'next/navigation'

const dictionaries = {
  fa: () =>
    import('../../messages/fa.json').then((module) => module.default),
  en: () =>
    import('../../messages/en.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const locales: Locale[] = ['fa', 'en']
export const defaultLocale: Locale = 'fa'

export const hasLocale = (l: string): l is Locale => l in dictionaries

export const getDictionary = async () => {
  const l = await locale()
  if (!hasLocale(l)) notFound()
  return dictionaries[l]()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
