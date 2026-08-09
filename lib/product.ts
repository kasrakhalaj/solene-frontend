export type ProductCategory = 'rings' | 'necklaces' | 'earrings' | 'bracelets'

export type ProductFinish = 'silver-steel' | 'gold-steel'

/** Backend-neutral product model consumed by UI and state layers. */
export interface Product {
  id: string
  slug: string
  title_fa: string
  title_en: string
  description_fa: string
  description_en: string
  /** Price in Tomans. */
  price: number
  /** Original price in Tomans before discount, if any. */
  originalPrice?: number
  category: ProductCategory
  finish: ProductFinish
  /** Internal trust-tag keys resolved through the locale dictionary. */
  trustTags: readonly string[]
  images: readonly string[]
  isNew: boolean
  isBestSeller: boolean
  /** Empty means one-size and requires no size selection. */
  sizes: readonly string[]
  inStock: boolean
}
