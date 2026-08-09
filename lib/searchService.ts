import { products } from './mockData'
import type { Product } from './product'
import type { SupportedLocale } from './siteConfig'

export interface SearchResult {
  product: Product
  matchedFields: string[]
}

export interface SearchService {
  /**
   * Search for products based on a query string and locale.
   */
  search(query: string, locale: SupportedLocale): SearchResult[]
  
  /**
   * Get a curated list of featured/popular products for the zero-state discovery.
   */
  getFeatured(limit?: number): Product[]
}

// ─── Normalization Helpers ───────────────────────────────────────────────────

/**
 * Normalizes Arabic/Persian characters and whitespace for consistent matching.
 */
function normalizeText(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/ي/g, 'ی') // Arabic ya to Persian ye
    .replace(/ك/g, 'ک') // Arabic kaf to Persian ke
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
}

// ─── Mock Implementation ─────────────────────────────────────────────────────

class MockSearchServiceImpl implements SearchService {
  search(query: string, locale: SupportedLocale): SearchResult[] {
    const q = normalizeText(query)
    if (!q) return []

    return products
      .map((product) => {
        const matchedFields: string[] = []

        // Localized title
        const title = locale === 'fa' ? product.title_fa : product.title_en
        if (normalizeText(title).includes(q)) matchedFields.push('title')

        // Localized description
        const desc = locale === 'fa' ? product.description_fa : product.description_en
        if (normalizeText(desc).includes(q)) matchedFields.push('description')

        // Cross-language fallback / structured fields
        if (normalizeText(product.category).includes(q)) matchedFields.push('category')
        if (normalizeText(product.finish).includes(q)) matchedFields.push('finish')
        if (normalizeText(product.slug).includes(q)) matchedFields.push('slug')

        if (matchedFields.length > 0) {
          return { product, matchedFields }
        }
        return null
      })
      .filter((res): res is SearchResult => res !== null)
  }

  getFeatured(limit: number = 3): Product[] {
    // Return bestsellers first, fallback to new items
    return products
      .filter((p) => p.isBestSeller)
      .slice(0, limit)
  }
}

// Frontend-only adapter. A remote Go implementation will require an asynchronous
// contract plus loading, cancellation, and transport-error handling in consumers.
export const searchService: SearchService = new MockSearchServiceImpl()
