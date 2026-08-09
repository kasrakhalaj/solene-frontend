import type { Metadata } from 'next'

/** Locale alternates for routes whose non-locale path is shared by /en and /fa. */
export function localeAlternates(path = ''): Metadata['alternates'] {
  return {
    languages: {
      fa: `/fa${path}`,
      en: `/en${path}`,
    },
  }
}
