'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { cn } from '@/lib/utils'

interface TrustBadgeRowProps {
  dict: Dictionary
  className?: string
}

export function TrustBadgeRow({ dict, className = '' }: TrustBadgeRowProps) {
  const shouldReduceMotion = useReducedMotion()
  const coreBadges = [
    { id: 'hypoallergenic', label: dict.product.hypoallergenic },
    { id: 'rustProof', label: dict.product.rustProof },
    { id: 'colorFast', label: dict.product.colorFast },
  ]

  // Create 12 copies to ensure it completely overflows the widest screens
  // Translating -50% means it perfectly loops exactly half-way through.
  const loopItems = Array(12).fill(coreBadges).flat()

  return (
    <div 
      className={cn("overflow-hidden flex items-center py-6 select-none", className)}
      dir="ltr"
    >
      <span className="sr-only">{coreBadges.map((badge) => badge.label).join(', ')}</span>
      <motion.div
        aria-hidden="true"
        className="flex items-center gap-12 shrink-0 pr-12"
        animate={shouldReduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={shouldReduceMotion ? { duration: 0 } : { repeat: Infinity, ease: "linear", duration: 40 }}
      >
        {loopItems.map((badge, idx) => (
          <div key={`${badge.id}-${idx}`} className="flex items-center gap-12">
            <span className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-brand-text whitespace-nowrap">
              {badge.label}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60 shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
