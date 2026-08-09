'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { useDialogA11y } from './useDialogA11y'


interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  dict: Dictionary
}

export function SizeGuideModal({ isOpen, onClose, dict }: SizeGuideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  useDialogA11y({ isOpen, onClose, containerRef: modalRef })

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.product.sizeGuide}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-brand-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
              <h2 className="text-lg font-semibold text-brand-text">
                {dict.product.sizeGuide}
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-cream transition-colors text-brand-muted hover:text-brand-text"
                aria-label={dict.nav.close}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-8">
                {/* Rings */}
                <section>
                  <h3 className="text-md font-medium mb-3 text-brand-gold">{dict.product.ringsSizeHeading}</h3>
                  <div className="overflow-x-auto rounded-xl border border-brand-border">
                    <table className="w-full text-sm text-center">
                      <thead className="bg-brand-cream text-brand-text">
                        <tr>
                          <th scope="col" className="py-2 px-3 font-medium border-b border-e border-brand-border">{dict.product.ringSize}</th>
                          <th scope="col" className="py-2 px-3 font-medium border-b border-e border-brand-border">{dict.product.ringDiameter}</th>
                          <th scope="col" className="py-2 px-3 font-medium border-b border-brand-border">{dict.product.ringCircumference}</th>
                        </tr>
                      </thead>
                      <tbody className="text-brand-muted">
                        <tr className="border-b border-brand-border last:border-0">
                          <td className="py-2 px-3 border-e border-brand-border">6</td>
                          <td className="py-2 px-3 border-e border-brand-border">16.5</td>
                          <td className="py-2 px-3">51.9</td>
                        </tr>
                        <tr className="border-b border-brand-border last:border-0">
                          <td className="py-2 px-3 border-e border-brand-border">7</td>
                          <td className="py-2 px-3 border-e border-brand-border">17.3</td>
                          <td className="py-2 px-3">54.4</td>
                        </tr>
                        <tr className="border-b border-brand-border last:border-0">
                          <td className="py-2 px-3 border-e border-brand-border">8</td>
                          <td className="py-2 px-3 border-e border-brand-border">18.1</td>
                          <td className="py-2 px-3">57.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Necklaces */}
                <section>
                  <h3 className="text-md font-medium mb-3 text-brand-gold">{dict.product.necklacesSizeHeading}</h3>
                  <div className="bg-brand-cream rounded-xl p-4 text-sm text-brand-muted space-y-2 text-justify">
                    <p>{dict.product.necklace40}</p>
                    <p>{dict.product.necklace45}</p>
                    <p>{dict.product.necklace50}</p>
                  </div>
                </section>
              </div>
            </div>
            
            <div className="p-4 border-t border-brand-border bg-brand-bg text-center">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-brand-text text-brand-surface text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {dict.nav.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
