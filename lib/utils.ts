import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely.
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a price in Tomans.
 * - In 'fa' locale: Persian numerals, e.g. "۲۴۵,۰۰۰ تومان"
 * - In 'en' locale: Western numerals, e.g. "245,000 Toman"
 */
export function formatPrice(amount: number, locale: 'fa' | 'en'): string {
  if (locale === 'fa') {
    const formatted = amount.toLocaleString('fa-IR')
    return `${formatted} تومان`
  }
  const formatted = amount.toLocaleString('en-US')
  return `${formatted} Toman`
}

/**
 * Format a number using locale-appropriate numerals.
 */
export function formatNumber(num: number, locale: 'fa' | 'en'): string {
  return locale === 'fa'
    ? num.toLocaleString('fa-IR')
    : num.toLocaleString('en-US')
}
