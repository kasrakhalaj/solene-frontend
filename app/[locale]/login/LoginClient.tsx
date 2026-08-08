'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { useAuthStore } from '@/lib/authStore'
import { useStore as useCartStore } from '@/lib/cartStore'
import { useLocale } from '@/app/[locale]/providers'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface LoginClientProps {
  dict: Dictionary
}

type AuthMode = 'phone' | 'otp' | 'email' | 'signup'

export function LoginClient({ dict }: LoginClientProps) {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const wishlistAdd = searchParams.get('wishlist_add')
  const isFromCheckout = redirectUrl?.includes('checkout')

  const { loginWithPhone, verifyOtp, loginWithEmail, signupWithEmail, isAuthenticated } = useAuthStore()
  const toggleWishlist = useCartStore((s) => s.toggleWishlist)
  const wishlist = useCartStore((s) => s.wishlist)

  const [mode, setMode] = useState<AuthMode>('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Phone State
  const [phone, setPhone] = useState('')
  
  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Email/Password State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      if (wishlistAdd && !wishlist.includes(wishlistAdd)) {
        toggleWishlist(wishlistAdd)
      }
      if (redirectUrl) router.push(redirectUrl)
      else router.push(`/${locale}/account`)
    }
  }, [isAuthenticated, router, locale, redirectUrl, wishlistAdd, toggleWishlist, wishlist])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await loginWithPhone(phone)
      setMode('otp')
    } catch {
      setError(dict.auth.errors.invalidPhone || dict.auth.errors.general)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i]
      }
      setOtp(newOtp)
      const nextIndex = pasted.length < 6 ? pasted.length : 5
      otpRefs.current[nextIndex]?.focus()
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) return
    setError(null)
    setIsLoading(true)
    try {
      await verifyOtp(phone, code)
      // Effect will redirect
    } catch {
      setError(dict.auth.errors.invalidOtp || dict.auth.errors.general)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('passwordMismatch')
        }
        if (password.length < 6) {
          throw new Error('passwordTooShort')
        }
        await signupWithEmail(email, password)
      } else {
        await loginWithEmail(email, password)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'passwordMismatch') setError(dict.auth.errors.passwordMismatch)
      else if (msg === 'passwordTooShort') setError(dict.auth.errors.passwordTooShort)
      else if (msg === 'email_exists') setError(dict.auth.errors.emailExists)
      else if (msg === 'invalid_credentials') setError(dict.auth.errors.invalidCredentials)
      else setError(dict.auth.errors.general)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text mb-2">
          {mode === 'otp' ? dict.auth.otpTitle : mode === 'signup' ? dict.auth.signup : dict.auth.loginTitle}
        </h1>
        <p className="text-sm text-brand-muted">
          {mode === 'otp' ? dict.auth.otpDescription.replace('{phone}', phone) : dict.auth.loginDescription}
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 mb-6 bg-red-50 text-red-700 rounded-xl text-sm"
        >
          <AlertCircle size={18} />
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {mode === 'phone' && (
          <motion.form 
            key="phone"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onSubmit={handlePhoneSubmit} 
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-brand-text">{dict.auth.phoneLabel}</label>
              <input 
                type="tel" 
                dir="ltr"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={dict.auth.phonePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-left"
                required
              />
            </div>
            <button 
              disabled={isLoading}
              className="w-full py-3 bg-brand-text text-brand-surface rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? '...' : dict.auth.sendOtp}
            </button>
            <div className="text-center mt-4 pt-4 border-t border-brand-border">
              <button type="button" onClick={() => setMode('email')} className="text-sm text-brand-muted hover:text-brand-text transition-colors">
                {dict.auth.loginWithEmail}
              </button>
            </div>
          </motion.form>
        )}

        {mode === 'otp' && (
          <motion.form 
            key="otp"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onSubmit={handleOtpSubmit} 
            className="space-y-6"
          >
            <div className="flex justify-center gap-2" dir="ltr">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { otpRefs.current[idx] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all bg-brand-cream/50"
                />
              ))}
            </div>
            <button 
              disabled={isLoading || otp.join('').length < 6}
              className="w-full py-3 bg-brand-text text-brand-surface rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? '...' : dict.auth.verifyOtp}
            </button>
            <div className="text-center mt-4 pt-4 border-t border-brand-border">
              <button type="button" onClick={() => setMode('phone')} className="text-sm text-brand-muted hover:text-brand-text transition-colors">
                {locale === 'fa' ? 'تغییر شماره' : 'Change Phone'}
              </button>
            </div>
          </motion.form>
        )}

        {(mode === 'email' || mode === 'signup') && (
          <motion.form 
            key="email"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onSubmit={handleEmailSubmit} 
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-brand-text">{dict.auth.emailLabel}</label>
              <input 
                type="email" 
                dir="ltr"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={dict.auth.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-left"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-brand-text">{dict.auth.passwordLabel}</label>
              <input 
                type="password" 
                dir="ltr"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-left"
                required
              />
            </div>
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-text">{dict.auth.confirmPasswordLabel}</label>
                <input 
                  type="password" 
                  dir="ltr"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-left"
                  required
                />
              </div>
            )}
            
            <button 
              disabled={isLoading}
              className="w-full py-3 bg-brand-text text-brand-surface rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {isLoading ? '...' : mode === 'signup' ? dict.auth.signup : dict.auth.loginTitle}
            </button>
            
            <div className="text-center mt-4 pt-4 border-t border-brand-border space-y-3">
              <button type="button" onClick={() => setMode(mode === 'email' ? 'signup' : 'email')} className="block w-full text-sm font-medium text-brand-text hover:opacity-80 transition-opacity">
                {mode === 'email' ? dict.auth.createAccount : dict.auth.haveAccount}
              </button>
              <button type="button" onClick={() => setMode('phone')} className="block w-full text-sm text-brand-muted hover:text-brand-text transition-colors">
                {dict.auth.loginWithPhone}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Guest Checkout explicitly supported */}
      {isFromCheckout && (
        <div className="mt-6 text-center">
          <Link href={`/${locale}/checkout`} className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-brand-text transition-colors">
            {locale === 'fa' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {dict.auth.continueAsGuest}
          </Link>
        </div>
      )}
    </div>
  )
}
