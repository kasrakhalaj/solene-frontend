'use client'

import { useToastStore } from '@/lib/toastStore'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import type { Dictionary } from '@/app/[locale]/dictionaries'

export function ToastProvider({ dict }: { dict: Dictionary }) {
  const { toasts, removeToast } = useToastStore()

  return (
    <div 
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center gap-2 p-4 sm:p-6 pointer-events-none pb-[calc(1rem+env(safe-area-inset-bottom))]"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-4 bg-brand-text text-brand-surface rounded-full px-5 py-3 shadow-xl max-w-sm w-full mx-auto"
            role="status"
          >
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-sm font-medium truncate">{toast.title}</span>
              {toast.description && (
                <span className="text-xs text-brand-surface/70 truncate">
                  {toast.description}
                </span>
              )}
            </div>

            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick()
                  removeToast(toast.id)
                }}
                className="shrink-0 text-xs font-semibold text-brand-surface underline underline-offset-2 hover:text-brand-surface/80 transition-colors"
              >
                {toast.action.label}
              </button>
            )}

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-full hover:bg-brand-surface/10 transition-colors text-brand-surface/70 hover:text-brand-surface"
              aria-label={dict.nav.close}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
