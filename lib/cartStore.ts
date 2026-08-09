import { create } from 'zustand'
import type { Product } from './product'

// ─── Cart types ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  /** Selected size, or empty string for one-size items */
  size: string
  quantity: number
}

/** Unique key for a cart line (product id + selected size) */
function cartItemKey(productId: string, size: string): string {
  return `${productId}::${size}`
}

// ─── Store shape ─────────────────────────────────────────────────────────────

interface StoreState {
  // ── Cart ──
  items: CartItem[]
  isCartOpen: boolean
  addToCart: (product: Product, size: string, quantity?: number) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // ── Wishlist ──
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

// ─── Derived selectors (pure functions — not stored redundantly) ─────────────

/** Total number of items in the cart (sum of quantities). */
export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/** Total price of the cart in Tomans. */
export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

// ─── Zustand store ───────────────────────────────────────────────────────────

export const useStore = create<StoreState>()((set, get) => ({
  // ── Cart state ──
  items: [],
  isCartOpen: false,

  addToCart: (product, size, quantity = 1) =>
    set((state) => {
      const key = cartItemKey(product.id, size)
      const existing = state.items.find(
        (i) => cartItemKey(i.product.id, i.size) === key,
      )

      if (existing) {
        return {
          items: state.items.map((i) =>
            cartItemKey(i.product.id, i.size) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        }
      }

      return { items: [...state.items, { product, size, quantity }] }
    }),

  removeFromCart: (productId, size) =>
    set((state) => ({
      items: state.items.filter(
        (i) => cartItemKey(i.product.id, i.size) !== cartItemKey(productId, size),
      ),
    })),

  updateQuantity: (productId, size, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (i) =>
              cartItemKey(i.product.id, i.size) !==
              cartItemKey(productId, size),
          ),
        }
      }
      return {
        items: state.items.map((i) =>
          cartItemKey(i.product.id, i.size) === cartItemKey(productId, size)
            ? { ...i, quantity }
            : i,
        ),
      }
    }),

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  // ── Wishlist state ──
  wishlist: [],

  toggleWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.includes(productId)
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId],
    })),

  isWishlisted: (productId) => get().wishlist.includes(productId),
}))
