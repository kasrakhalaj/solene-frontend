'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { Product } from '@/lib/mockData'
import { useStore } from '@/lib/cartStore'
import { useLocale } from '@/app/[locale]/providers'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { motion, AnimatePresence } from 'motion/react'

interface ProductCardProps {
  product: Product
  dict: Dictionary
}

export function ProductCard({ product, dict }: ProductCardProps) {
  const locale = useLocale()
  const isRtl = locale === 'fa'
  const title = isRtl ? product.title_fa : product.title_en
  
  const [isHovered, setIsHovered] = useState(false)
  
  const wishlist = useStore((s) => s.wishlist)
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const isWishlisted = wishlist.includes(product.id)
  
  const addToCart = useStore((s) => s.addToCart)
  const [isAdded, setIsAdded] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.inStock) return
    
    // For single-size products, add immediately. For multi-size, we should redirect to PDP,
    // but for the quick add demo, we'll just add the first size.
    const size = product.sizes.length > 0 ? product.sizes[0] : ''
    addToCart(product, size, 1)
    
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist(product.id)
  }

  return (
    <Link 
      href={`/${locale}/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] bg-brand-cream rounded-2xl overflow-hidden mb-3">
        {/* Badges */}
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-brand-gold text-white text-[10px] font-bold px-2 py-1 rounded-full leading-none">
              {dict.product.new}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-text text-brand-surface text-[10px] font-bold px-2 py-1 rounded-full leading-none">
              {dict.product.bestSeller}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full leading-none">
              {dict.product.outOfStock}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 end-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-brand-text hover:bg-white transition-colors"
          aria-label={dict.nav.wishlist}
        >
          <Heart 
            size={16} 
            className={cn("transition-colors", isWishlisted && "fill-brand-gold text-brand-gold")} 
          />
        </button>

        {/* Primary Image */}
        <Image
          src={product.images[0]}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-opacity duration-500",
            isHovered && product.images.length > 1 ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Secondary Image (Hover) */}
        {product.images.length > 1 && (
          <Image
            src={product.images[1]}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700",
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
          />
        )}

        {/* Quick Add overlay */}
        <div className={cn(
          "absolute bottom-0 inset-x-0 p-3 transition-transform duration-300",
          isHovered ? "translate-y-0" : "translate-y-full"
        )}>
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/90 backdrop-blur-md text-sm font-medium text-brand-text hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Check size={16} className="text-green-600" />
                  <span>{dict.product.addedToCart}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>{product.inStock ? dict.product.quickAdd : dict.product.outOfStock}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-brand-text truncate">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-gold">
            {formatPrice(product.price, locale)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-brand-muted line-through">
              {formatPrice(product.originalPrice, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
