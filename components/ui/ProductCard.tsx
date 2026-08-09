'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/product'
import { useStore as useCartStore } from '@/lib/cartStore'
import { useWishlistAction } from '@/components/providers/WishlistProvider'
import { useLocale } from '@/app/[locale]/providers'
import { useToastStore } from '@/lib/toastStore'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { motion, AnimatePresence } from 'motion/react'

interface ProductCardProps {
  product: Product
  dict: Dictionary
  priority?: boolean
}

export function ProductCard({ product, dict, priority = false }: ProductCardProps) {
  const locale = useLocale()
  const router = useRouter()
  const isRtl = locale === 'fa'
  const title = isRtl ? product.title_fa : product.title_en
  
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  
  const wishlist = useCartStore((s) => s.wishlist)
  const handleWishlistAction = useWishlistAction()
  const isWishlisted = wishlist.includes(product.id)
  
  const addToCart = useCartStore((s) => s.addToCart)
  const openCart = useCartStore((s) => s.openCart)
  const addToast = useToastStore((s) => s.addToast)
  const [isAdded, setIsAdded] = useState(false)
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
  }, [])

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.inStock) return

    if (product.sizes.length > 0) {
      router.push(`/${locale}/products/${product.slug}`)
      return
    }

    addToCart(product, '', 1)
    
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
    addedTimerRef.current = setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    handleWishlistAction(product.id)
  }

  return (
    <article
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-brand-cream shadow-[0_10px_28px_rgba(69,55,35,0.06)] transition-shadow duration-500 group-hover:shadow-[0_18px_38px_rgba(69,55,35,0.12)]">
        <Link
          href={`/${locale}/products/${product.slug}`}
          aria-label={title}
          className="absolute inset-0"
        >
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

          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              isHovered && product.images[1] ? "opacity-0 scale-105" : "opacity-100 scale-100",
              !isImageLoaded && "opacity-0"
            )}
            priority={priority}
            onLoad={() => setIsImageLoaded(true)}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${title} — ${dict.product.alternateView}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-105",
                !isImageLoaded && "opacity-0"
              )}
              priority={priority}
            />
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute end-3 top-3 z-10 flex min-h-10 min-w-10 items-center justify-center rounded-full bg-white/85 text-brand-text shadow-sm backdrop-blur-md hover:scale-105 hover:bg-white"
          aria-label={isWishlisted ? dict.product.removeFromWishlist : dict.product.addToWishlist}
        >
          <Heart 
            size={16} 
            className={cn("transition-colors", isWishlisted && "fill-brand-gold text-brand-gold")} 
          />
        </button>

        {/* Quick Add overlay */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 z-10 p-3 transition-transform duration-300 group-focus-within:translate-y-0 md:translate-y-full",
          isHovered && "md:translate-y-0"
        )}>
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white/92 px-3 py-2.5 text-xs font-medium text-brand-text shadow-sm backdrop-blur-md hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
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
      <Link href={`/${locale}/products/${product.slug}`} className="block space-y-1.5">
        <h3 className="truncate text-sm font-medium tracking-[-0.01em] text-brand-text transition-colors group-hover:text-brand-gold">
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
      </Link>
    </article>
  )
}
