/**
 * Centralised brand configuration.
 * All brand names and taglines are sourced from here —
 * never hardcoded in components — so the name can be swapped
 * without a grep-and-replace across the codebase.
 */

export const siteConfig = {
  /** Latin/English brand name (primary display in latin-script contexts) */
  brandLatin: 'Solene',
  /** Persian brand name */
  brandFa: 'سولن',
  /** Short English tagline */
  taglineEn: 'Steel Fashion Accessories',
  /** Short Farsi tagline */
  taglineFa: 'بدلیجات و اکسسوری استیل',
  /** Long English tagline */
  taglineLongEn: 'Hypoallergenic Steel Jewelry — Durable, Beautiful, Everyday',
  /** Long Farsi tagline */
  taglineLongFa: 'جواهرات استیل ضدحساسیت — بادوام، زیبا، برای هر روز',
  /** Product category: steel fashion accessories (بدلیجات استیل), not precious metal */
  category: 'steel-accessories',
  /** Free shipping threshold in Tomans */
  freeShippingThreshold: 1_000_000,
  /** Instagram handle */
  instagram: '@solene.accessories',
  /** WhatsApp number for coordination */
  whatsapp: '+989120000000',
  /** Support email */
  supportEmail: 'support@solene.store',
  /** Supported locales */
  locales: ['fa', 'en'] as const,
  /** Default locale */
  defaultLocale: 'fa' as const,
} as const

export type SupportedLocale = typeof siteConfig.locales[number]
