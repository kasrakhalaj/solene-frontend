'use client'

import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { selectIsAuthenticated, useAuthStore } from '@/lib/authStore'
import { useStore as useCartStore } from '@/lib/cartStore'
import { useToastStore } from '@/lib/toastStore'
import { motion, AnimatePresence } from 'motion/react'
import { useLocale } from '@/app/[locale]/providers'
import { X } from 'lucide-react'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { useDialogA11y } from '@/components/ui/useDialogA11y'

interface WishlistContextType {
  handleWishlistAction: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function useWishlistAction() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlistAction must be used within a WishlistProvider')
  }
  return context.handleWishlistAction
}

interface WishlistProviderProps {
  children: ReactNode
  dict: Dictionary
}

export function WishlistProvider({ children, dict }: WishlistProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingProductId, setPendingProductId] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const toggleWishlist = useCartStore((s) => s.toggleWishlist)
  
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const handleWishlistAction = (productId: string) => {
    if (isAuthenticated) {
      // Already authenticated, proceed with action via the store (which mocks our backend)
      const isCurrentlyWishlisted = useCartStore.getState().wishlist.includes(productId)
      toggleWishlist(productId)
      
      if (isCurrentlyWishlisted) {
        useToastStore.getState().addToast({
          title: dict.toast.removedFromWishlist
        })
      } else {
        useToastStore.getState().addToast({
          title: dict.toast.addedToWishlist
        })
      }
    } else {
      // Guest user: intercept and show prompt
      setPendingProductId(productId)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setPendingProductId(null)
  }

  // When user clicks login, we redirect them to /login with the return URL.
  // We can also pass the pendingProductId in the URL so the login page could theoretically auto-add it.
  const handleLoginClick = () => {
    closeModal()
    const returnUrl = encodeURIComponent(pathname)
    let url = `/${locale}/login?redirect=${returnUrl}`
    if (pendingProductId) {
      url += `&wishlist_add=${pendingProductId}`
    }
    router.push(url)
  }

  useDialogA11y({
    isOpen: isModalOpen,
    onClose: closeModal,
    containerRef: modalRef,
  })

  return (
    <WishlistContext.Provider value={{ handleWishlistAction }}>
      {children}
      
      {/* Global Login Prompt Modal for Wishlist */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/40 z-[100]"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="wishlist-modal-title"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-brand-surface rounded-2xl shadow-2xl p-6 z-[101] flex flex-col items-center text-center"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-brand-muted hover:text-brand-text hover:bg-brand-cream rounded-full transition-colors"
                aria-label={dict.nav.close}
              >
                <X size={20} />
              </button>
              
              {/* Heart Icon Graphic */}
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mb-4 text-brand-text">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>

              <h2 id="wishlist-modal-title" className="text-xl font-semibold text-brand-text mb-2">
                {dict.wishlistModal.title}
              </h2>
              
              <p className="text-brand-muted text-sm mb-8 leading-relaxed">
                {dict.wishlistModal.description}
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 bg-brand-text text-brand-surface rounded-full font-medium hover:bg-brand-text/90 transition-colors"
                >
                  {dict.wishlistModal.login}
                </button>
                
                <button
                  onClick={closeModal}
                  className="w-full py-3 text-brand-text font-medium hover:bg-brand-cream rounded-full transition-colors"
                >
                  {dict.wishlistModal.notNow}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </WishlistContext.Provider>
  )
}
