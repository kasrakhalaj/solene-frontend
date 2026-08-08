'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, ArrowRight, ArrowLeft } from 'lucide-react'
import { useLocale } from '@/app/[locale]/providers'
import { siteConfig } from '@/lib/siteConfig'
import type { Dictionary } from '@/app/[locale]/dictionaries'

interface FooterProps {
  dict: Dictionary
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function Footer({ dict }: FooterProps) {
  const locale = useLocale()
  const isRtl = locale === 'fa'
  
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error')
      return
    }
    
    setStatus('loading')
    // Simulate API call for frontend-only interaction
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 800)
  }

  const brandName = isRtl ? siteConfig.brandFa : siteConfig.brandLatin
  const tagline = isRtl ? siteConfig.taglineLongFa : siteConfig.taglineLongEn

  return (
    <footer className="bg-brand-cream border-t border-brand-gold/20 pt-16 pb-8 px-4 lg:px-16 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <Link href={`/${locale}`} className="inline-block">
            <span className="text-2xl font-semibold text-brand-gold tracking-wide uppercase">
              {brandName}
            </span>
          </Link>
          <p className="text-brand-muted leading-relaxed max-w-sm">
            {tagline}
          </p>
          <p className="text-sm text-brand-muted/80">
            {dict.common.tagline}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brand-text mb-6">
            {dict.footer.quickLinks}
          </h3>
          <ul className="space-y-3">
            {[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.collections, href: `/${locale}/collections` },
              { label: dict.nav.rings, href: `/${locale}/collections/rings` },
              { label: dict.nav.necklaces, href: `/${locale}/collections/necklaces` },
              { label: dict.nav.earrings, href: `/${locale}/collections/earrings` },
              { label: dict.nav.bracelets, href: `/${locale}/collections/bracelets` },
              { label: dict.nav.about, href: `/${locale}/about` },
            ].map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="text-brand-muted hover:text-brand-gold transition-colors inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brand-text mb-6">
            {dict.footer.contact}
          </h3>
          <ul className="space-y-4">
            <li>
              <a 
                href={`mailto:${siteConfig.supportEmail}`}
                className="flex items-center gap-3 text-brand-muted hover:text-brand-gold transition-colors"
              >
                <Mail className="w-5 h-5 shrink-0" />
                <span dir="ltr">{siteConfig.supportEmail}</span>
              </a>
            </li>
            <li>
              <a 
                href={`https://wa.me/${siteConfig.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brand-muted hover:text-brand-gold transition-colors"
              >
                <Phone className="w-5 h-5 shrink-0" />
                <span dir="ltr">{siteConfig.whatsapp}</span>
              </a>
            </li>
            <li>
              <a 
                href={`https://instagram.com/${siteConfig.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brand-muted hover:text-brand-gold transition-colors"
              >
                <InstagramIcon className="w-5 h-5 shrink-0" />
                <span dir="ltr">{siteConfig.instagram}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-brand-text mb-6">
            {dict.footer.newsletter}
          </h3>
          <form onSubmit={handleSubscribe} className="space-y-3 relative">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                placeholder={dict.footer.newsletterPlaceholder}
                className="w-full bg-white border border-brand-gold/30 rounded-full py-3 px-6 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all disabled:opacity-50 text-brand-text placeholder:text-brand-muted/50"
                disabled={status === 'loading' || status === 'success'}
                aria-label={dict.footer.newsletterPlaceholder}
                dir={isRtl && !email ? 'rtl' : 'ltr'}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                aria-label={dict.footer.newsletterSubmit}
                className="absolute top-1/2 -translate-y-1/2 end-2 w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isRtl ? (
                  <ArrowLeft className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
            {status === 'error' && (
              <p className="text-red-500 text-sm px-4" role="alert">
                {dict.footer.newsletterError}
              </p>
            )}
            {status === 'success' && (
              <p className="text-green-600 text-sm px-4" role="status">
                {dict.footer.newsletterSuccess}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-brand-gold/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-muted/80">
        <p>
          &copy; {new Date().getFullYear()} {brandName}. {dict.footer.rights}.
        </p>
        <p className="flex items-center gap-1">
          {dict.common.tagline}
        </p>
      </div>
    </footer>
  )
}
