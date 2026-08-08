'use client'

import { ShieldCheck, Droplets, Sparkles } from 'lucide-react'
import type { Dictionary } from '@/app/[locale]/dictionaries'

interface TrustBadgeRowProps {
  dict: Dictionary
  className?: string
}

export function TrustBadgeRow({ dict, className = '' }: TrustBadgeRowProps) {
  const badges = [
    {
      id: 'hypoallergenic',
      label: dict.product.hypoallergenic,
      icon: ShieldCheck,
    },
    {
      id: 'rustProof',
      label: dict.product.rustProof,
      icon: Droplets,
    },
    {
      id: 'colorFast',
      label: dict.product.colorFast,
      icon: Sparkles,
    },
  ]

  return (
    <div className={`grid grid-cols-3 gap-2 py-4 border-y border-brand-border ${className}`}>
      {badges.map((badge) => {
        const Icon = badge.icon
        return (
          <div key={badge.id} className="flex flex-col items-center justify-center gap-2 text-center p-2">
            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-gold">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-medium text-brand-text leading-tight">
              {badge.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
