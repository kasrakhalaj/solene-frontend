'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cartTotal, useStore } from '@/lib/cartStore'
import { useAuthStore } from '@/lib/authStore'
import { formatPrice, cn } from '@/lib/utils'
import type { Dictionary } from '@/app/[locale]/dictionaries'
import { siteConfig } from '@/lib/siteConfig'
import { useLocale } from '@/app/[locale]/providers'
import { CreditCard, MessageCircle, Building2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface CheckoutClientProps {
  dict: Dictionary
}

type PaymentMethod = 'card' | 'whatsapp' | 'gateway'

export function CheckoutClient({ dict }: CheckoutClientProps) {
  const locale = useLocale()
  const isRtl = locale === 'fa'
  
  const items = useStore(s => s.items)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const { user } = useAuthStore()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhone(prev => prev || user.phone || '')
      if (user.displayName) {
        const parts = user.displayName.split(' ')
        setFirstName(prev => prev || parts[0] || '')
        if (parts.length > 1) {
          setLastName(prev => prev || parts.slice(1).join(' ') || '')
        }
      }
    }
  }, [user])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate totals
  const subtotal = cartTotal(items)
  const shippingFee = subtotal >= siteConfig.freeShippingThreshold ? 0 : 50_000
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center text-brand-gold mb-6">
          <ShoppingBagIcon />
        </div>
        <h2 className="text-2xl font-semibold text-brand-text mb-2">{dict.cart.empty}</h2>
        <p className="text-brand-muted mb-8">{dict.cart.emptyDescription}</p>
        <Link 
          href={`/${locale}/collections/rings`}
          className="px-8 py-3 bg-brand-text text-brand-surface rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          {dict.cart.continueShopping}
        </Link>
      </div>
    )
  }

  const handleSimulatePayment = () => {
    setIsProcessing(true)
    setPaymentResult(null)
    setTimeout(() => {
      setIsProcessing(false)
      // 90% success rate for simulation
      setPaymentResult(Math.random() > 0.1 ? 'success' : 'failed')
    }, 2000)
  }

  const generateWhatsAppUrl = () => {
    const text = isRtl 
      ? `سلام، من می‌خواهم سفارش زیر را ثبت کنم:\n\n${items.map((c) => `- ${c.product.title_fa} (سایز: ${c.size || 'ندارد'} | تعداد: ${c.quantity})`).join('\n')}\n\nمبلغ کل: ${formatPrice(total, 'fa')}`
      : `Hello, I'd like to place an order:\n\n${items.map((c) => `- ${c.product.title_en} (Size: ${c.size || 'N/A'} | Qty: ${c.quantity})`).join('\n')}\n\nTotal: ${formatPrice(total, 'en')}`
    
    return `https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent(text)}`
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
      {/* Left: Form */}
      <div className="flex-1 space-y-12">
        {/* Shipping Form */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-brand-text">{dict.checkout.shipping}</h2>
            {!user && (
              <Link 
                href={`/${locale}/login?redirect=/${locale}/checkout`} 
                className="text-sm text-brand-muted hover:text-brand-text transition-colors underline underline-offset-4"
              >
                {dict.auth.loginTitle}
              </Link>
            )}
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName" className="text-sm font-medium text-brand-text">{dict.checkout.firstName}</label>
              <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all" required />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="lastName" className="text-sm font-medium text-brand-text">{dict.checkout.lastName}</label>
              <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all" required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="phone" className="text-sm font-medium text-brand-text">{dict.checkout.phone}</label>
              <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all text-left" dir="ltr" required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-brand-text">{dict.checkout.address}</label>
              <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} className="px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all" required />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="province" className="text-sm font-medium text-brand-text">{dict.checkout.province}</label>
              <input id="province" type="text" value={province} onChange={e => setProvince(e.target.value)} className="px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all" required />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium text-brand-text">{dict.checkout.city}</label>
              <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} className="px-4 py-3 rounded-xl border border-brand-border focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all" required />
            </div>
          </form>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-xl font-semibold text-brand-text mb-6">{dict.checkout.paymentMethod}</h2>
          <div className="space-y-4">
            
            {/* 1. Card Transfer */}
            <div 
              className={cn("border rounded-2xl overflow-hidden transition-all", paymentMethod === 'card' ? "border-brand-gold" : "border-brand-border")}
            >
              <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-brand-cream/50 transition-colors">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')}
                  className="w-4 h-4 text-brand-gold focus:ring-brand-gold accent-brand-gold"
                />
                <CreditCard size={20} className="text-brand-muted" />
                <span className="font-medium text-brand-text">{dict.checkout.cardTransfer}</span>
              </label>
              
              <AnimatePresence>
                {paymentMethod === 'card' && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 text-sm text-brand-muted border-t border-brand-border mt-2 space-y-4">
                      <p>{dict.checkout.cardTransferInstructions}</p>
                      <div className="p-3 bg-brand-cream rounded-xl text-center font-mono tracking-wider text-lg text-brand-text" dir="ltr">
                        6037 - 9911 - 2233 - 4455
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*,.pdf"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          fileInputRef.current?.click()
                        }}
                        className="flex items-center justify-center gap-2 w-full py-3 border border-brand-gold text-brand-gold rounded-xl font-medium hover:bg-brand-gold hover:text-white transition-colors truncate px-4"
                      >
                        <span className="truncate">{receiptFile ? receiptFile.name : dict.checkout.uploadReceipt}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. WhatsApp */}
            <div 
              className={cn("border rounded-2xl overflow-hidden transition-all", paymentMethod === 'whatsapp' ? "border-brand-gold" : "border-brand-border")}
            >
              <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-brand-cream/50 transition-colors">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'whatsapp'} 
                  onChange={() => setPaymentMethod('whatsapp')}
                  className="w-4 h-4 text-brand-gold focus:ring-brand-gold accent-brand-gold"
                />
                <MessageCircle size={20} className="text-green-500" />
                <span className="font-medium text-brand-text">{dict.checkout.whatsapp}</span>
              </label>
              
              <AnimatePresence>
                {paymentMethod === 'whatsapp' && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 border-t border-brand-border mt-2">
                      <a 
                        href={generateWhatsAppUrl()} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors gap-2"
                      >
                        <MessageCircle size={18} />
                        {dict.checkout.whatsapp}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Bank Gateway (Simulated) */}
            <div 
              className={cn("border rounded-2xl overflow-hidden transition-all", paymentMethod === 'gateway' ? "border-brand-gold" : "border-brand-border")}
            >
              <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-brand-cream/50 transition-colors">
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'gateway'} 
                  onChange={() => setPaymentMethod('gateway')}
                  className="w-4 h-4 text-brand-gold focus:ring-brand-gold accent-brand-gold"
                />
                <Building2 size={20} className="text-brand-muted" />
                <span className="font-medium text-brand-text">{dict.checkout.bankGateway}</span>
              </label>
              
              <AnimatePresence>
                {paymentMethod === 'gateway' && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 border-t border-brand-border mt-2 space-y-4">
                      <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded-xl text-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>{dict.checkout.testModeNote}</p>
                      </div>
                      <button 
                        onClick={handleSimulatePayment}
                        disabled={isProcessing}
                        className="w-full py-3 bg-brand-text text-brand-surface rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isProcessing ? dict.checkout.processing : dict.checkout.simulatePayment}
                      </button>
                      
                      {paymentResult === 'success' && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm justify-center">
                          <CheckCircle2 size={16} />
                          {dict.checkout.paymentSuccess}
                        </div>
                      )}
                      
                      {paymentResult === 'failed' && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm justify-center">
                          <AlertCircle size={16} />
                          {dict.checkout.paymentFailed}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full lg:w-[400px]">
        <div className="sticky top-24 bg-brand-cream/30 p-6 rounded-3xl border border-brand-border">
          <h2 className="text-xl font-semibold text-brand-text mb-6">{dict.checkout.orderSummary}</h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pe-2">
            {items.map((item) => (
              <div key={`${item.product.id}::${item.size}`} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-cream shrink-0">
                  <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                  <div className="absolute -top-2 -end-2 w-5 h-5 bg-brand-text text-brand-surface text-[10px] font-bold rounded-full flex items-center justify-center z-10 border border-white">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-brand-text truncate">
                    {isRtl ? item.product.title_fa : item.product.title_en}
                  </h3>
                  {item.size && (
                    <p className="text-xs text-brand-muted mt-1">{item.size}</p>
                  )}
                </div>
                <div className="text-sm font-semibold text-brand-text shrink-0">
                  {formatPrice(item.product.price * item.quantity, locale)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-brand-border text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>{dict.cart.subtotal}</span>
              <span className="font-medium text-brand-text">{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>{dict.checkout.shippingFee}</span>
              <span className="font-medium text-brand-text">
                {shippingFee === 0 ? dict.checkout.freeShipping : formatPrice(shippingFee, locale)}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-brand-border">
            <span className="font-semibold text-brand-text">{dict.checkout.total}</span>
            <span className="text-xl font-bold text-brand-gold">{formatPrice(total, locale)}</span>
          </div>

          <button 
            className="w-full mt-8 py-4 bg-brand-text text-brand-surface rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            {dict.checkout.placeOrder}
          </button>
        </div>
      </div>
    </div>
  )
}

function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
