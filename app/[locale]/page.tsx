import { getDictionary } from './dictionaries'
import { siteConfig } from '../../lib/siteConfig'

/**
 * Placeholder homepage — replaced in Step 5.
 * Verifies locale routing, font loading, and direction are working.
 */
export default async function LocalePage() {
  const dict = await getDictionary()

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 py-24 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-brand-text">
        {siteConfig.brandLatin}
        <span className="mx-3 text-brand-gold">/</span>
        {siteConfig.brandFa}
      </h1>
      <p className="text-lg text-brand-muted max-w-md">
        {dict.common.taglineLong}
      </p>
      <div className="mt-4 flex gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm text-brand-muted">
          ✓ {dict.product.hypoallergenic}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm text-brand-muted">
          ✓ {dict.product.rustProof}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm text-brand-muted">
          ✓ {dict.product.colorFast}
        </span>
      </div>
    </main>
  )
}
