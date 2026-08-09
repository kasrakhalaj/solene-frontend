import {
  categories,
  getBestSellers,
  getProductBySlug,
  getProductsByCategory,
  products,
} from './mockData'
import type { Product, ProductCategory } from './product'

export interface CatalogCategory {
  key: ProductCategory
  slug: string
}

export interface CatalogService {
  getAll(): readonly Product[]
  getBySlug(slug: string): Product | undefined
  getByCategory(category: ProductCategory): Product[]
  getBestSellers(): Product[]
  getCategories(): readonly CatalogCategory[]
  getByIds(ids: readonly string[]): Product[]
}

class MockCatalogService implements CatalogService {
  getAll(): readonly Product[] {
    return products
  }

  getBySlug(slug: string): Product | undefined {
    return getProductBySlug(slug)
  }

  getByCategory(category: ProductCategory): Product[] {
    return getProductsByCategory(category)
  }

  getBestSellers(): Product[] {
    return getBestSellers()
  }

  getCategories(): readonly CatalogCategory[] {
    return categories
  }

  getByIds(ids: readonly string[]): Product[] {
    const productsById = new Map(products.map((product) => [product.id, product]))
    return ids
      .map((id) => productsById.get(id))
      .filter((product): product is Product => product !== undefined)
  }
}

// Frontend-only adapter. A Go-backed catalog will require an asynchronous
// contract, request cancellation, caching policy, and explicit DTO mapping.
export const catalogService: CatalogService = new MockCatalogService()
