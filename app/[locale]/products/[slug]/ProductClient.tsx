'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/product'
import { ZoomableGallery } from '@/components/ui/ZoomableGallery'
import { TrustBadgeRow } from '@/components/ui/TrustBadgeRow'
import { SizeGuideModal } from '@/components/ui/SizeGuideModal'
import { ProductCard } from '@/components/ui/ProductCard'
import { useStore as useCartStore } from '@/lib/cartStore'
import { useWishlistAction } from '@/components/providers/WishlistProvider'
import { useToastStore } from '@/lib/toastStore'
import { formatPrice, cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { Heart, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { useLocale } from '@/app/[locale]/providers'

interface ProductClientProps {
  product: Product
  relatedProducts: Product[]
  dict: Dictionary
}

export function ProductClient({ product, relatedProducts, dict }: ProductClientProps) {
  const locale = useLocale()
  const isRtl = locale === 'fa'
  const title = isRtl ? product.title_fa : product.title_en
  const description = isRtl ? product.description_fa : product.description_en

  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '')
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  
  const [isAdded, setIsAdded] = useState(false)
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const addToCartRef = useRef<HTMLButtonElement>(null)
  const isAddToCartInView = useInView(addToCartRef)
  
  const addToCart = useCartStore(s => s.addToCart)
  const handleWishlistAction = useWishlistAction()
  const isWishlisted = useCartStore(s => s.wishlist.includes(product.id))
  const openCart = useCartStore(s => s.openCart)
  const addToast = useToastStore(s => s.addToast)

  useEffect(() => () => {
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
  }, [])

  const handleAddToCart = () => {
    if (!product.inStock) return
    if (product.sizes.length > 0 && !selectedSize) return
    
    addToCart(product, selectedSize, quantity)
    setIsAdded(true)
    
    addToast({
      title: dict.toast?.addedToCart || (isRtl ? 'به سبد خرید اضافه شد' : 'Added to cart'),
      description: title,
      action: {
        label: dict.toast?.viewCart || (isRtl ? 'مشاهده سبد' : 'View Cart'),
        onClick: openCart
      }
    })

    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    addedTimerRef.current = setTimeout(() => {
      setIsAdded(false)
    }, 1500)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-24">
        {/* Left: Gallery */}
        <div className="w-full">
          <ZoomableGallery images={product.images} title={title} dict={dict} />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-semibold text-brand-text mb-4">
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-semibold text-brand-gold">
                {formatPrice(product.price, locale)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-brand-muted line-through">
                  {formatPrice(product.originalPrice, locale)}
                </span>
              )}
            </div>
          </div>

          <p className="text-brand-muted text-base leading-relaxed mb-8">
            {description}
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between py-4 border-y border-brand-border">
              <span className="text-sm font-medium text-brand-text">{dict.product.finish}</span>
              <span className="text-sm text-brand-muted">
                {product.finish === 'silver-steel' ? dict.product.silverSteel : dict.product.goldSteel}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-brand-border">
              <span className="text-sm font-medium text-brand-text">{dict.product.inStock}</span>
              <span className={cn("text-sm font-medium", product.inStock ? "text-green-600" : "text-red-600")}>
                {product.inStock ? dict.product.inStock : dict.product.outOfStock}
              </span>
            </div>
          </div>

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-brand-text">{dict.product.selectSize}</span>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-sm text-brand-muted underline hover:text-brand-text transition-colors"
                >
                  {dict.product.sizeGuide}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                    className={cn(
                      "min-w-12 h-12 px-4 rounded-full border text-sm font-medium transition-all",
                      selectedSize === size 
                        ? "border-brand-gold bg-brand-gold text-white" 
                        : "border-brand-border text-brand-text hover:border-brand-text"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-brand-border rounded-full h-14 bg-brand-surface">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-brand-muted hover:text-brand-text"
                aria-label={dict.product.decreaseQuantity}
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium text-brand-text">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center text-brand-muted hover:text-brand-text"
                aria-label={dict.product.increaseQuantity}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              ref={addToCartRef}
              onClick={handleAddToCart}
              disabled={!product.inStock || (product.sizes.length > 0 && !selectedSize)}
              className="flex-1 h-14 rounded-full bg-brand-text text-brand-surface font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={20} className="text-brand-gold" />
                    <span>{dict.product.addedToCart}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag size={20} />
                    <span>{product.inStock ? dict.product.addToCart : dict.product.outOfStock}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => handleWishlistAction(product.id)}
              className="w-14 h-14 rounded-full border border-brand-border flex items-center justify-center text-brand-text hover:bg-brand-cream transition-colors"
              aria-label={isWishlisted ? dict.product.removeFromWishlist : dict.product.addToWishlist}
            >
              <Heart size={20} className={cn("transition-colors", isWishlisted && "fill-brand-gold text-brand-gold")} />
            </button>
          </div>

          <TrustBadgeRow dict={dict} />
        </div>
      </div>

      {/* Cross-Sell */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-brand-border">
          <h2 className="text-2xl font-semibold text-brand-text mb-8">{dict.product.relatedProducts}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} dict={dict} />
            ))}
          </div>
        </section>
      )}

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} dict={dict} />

      {/* Sticky Mobile Add To Cart */}
      <AnimatePresence>
        {!isAddToCartInView && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-brand-surface border-t border-brand-border p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:hidden pb-[calc(1rem+env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center gap-4 max-w-lg mx-auto">
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-brand-cream shrink-0">
                <Image src={product.images[0]} alt={title} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-brand-text truncate">{title}</h3>
                <p className="text-sm font-semibold text-brand-muted">
                  {formatPrice(product.price, locale)}
                  {selectedSize && <span className="mx-2 opacity-50">|</span>}
                  {selectedSize && <span>{selectedSize}</span>}
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || (product.sizes.length > 0 && !selectedSize)}
                className="h-11 px-6 rounded-full bg-brand-text text-brand-surface text-sm font-medium shrink-0 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
              >
                {isAdded ? (
                  <Check size={18} className="text-brand-gold" />
                ) : (
                  dict.product.addToCart
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
