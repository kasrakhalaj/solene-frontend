import type { Product, ProductCategory } from './product'

// ─── Trust tags (internal keys — resolved via dictionary at render time) ──────

const TRUST_TAGS = ['hypoallergenic', 'rustProof', 'colorFast'] as const

// ─── Helper to build deterministic placeholder image URLs ────────────────────

function img(seed: number, w = 800, h = 800): string {
  return `https://picsum.photos/seed/solene${seed}/${w}/${h}`
}

// ─── Product Catalog ─────────────────────────────────────────────────────────

export const products: Product[] = [
  // ────────────────── RINGS ──────────────────
  {
    id: 'ring-001',
    slug: 'minimalist-band-ring',
    title_fa: 'انگشتر حلقه مینیمال',
    title_en: 'Minimalist Band Ring',
    description_fa:
      'انگشتر حلقه‌ای ساده و شیک از جنس استیل ضدزنگ با پوشش نقره‌ای. طراحی مینیمال مناسب استفاده روزمره. ضدحساسیت و بدون تغییر رنگ.',
    description_en:
      'A sleek, simple band ring crafted from rust-proof stainless steel with a silver-tone finish. Minimalist design perfect for everyday wear. Hypoallergenic with lasting color.',
    price: 185_000,
    category: 'rings',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(101), img(102), img(103)],
    isNew: true,
    isBestSeller: false,
    sizes: ['6', '7', '8', '9'],
    inStock: true,
  },
  {
    id: 'ring-002',
    slug: 'twisted-gold-ring',
    title_fa: 'انگشتر پیچشی طلایی',
    title_en: 'Twisted Gold-Tone Ring',
    description_fa:
      'انگشتر پیچشی با روکش طلایی از جنس استیل ضدزنگ. جلوه‌ای لوکس بدون نگرانی از حساسیت پوستی یا تغییر رنگ.',
    description_en:
      'A statement twisted ring with gold-plated stainless steel finish. Luxurious look without worrying about skin sensitivity or tarnishing.',
    price: 245_000,
    originalPrice: 295_000,
    category: 'rings',
    finish: 'gold-steel',
    trustTags: TRUST_TAGS,
    images: [img(104), img(105), img(106)],
    isNew: false,
    isBestSeller: true,
    sizes: ['6', '7', '8', '9'],
    inStock: true,
  },
  {
    id: 'ring-003',
    slug: 'signet-steel-ring',
    title_fa: 'انگشتر مُهر استیل',
    title_en: 'Signet Steel Ring',
    description_fa:
      'انگشتر مُهر کلاسیک از استیل نقره‌ای با سطح صیقلی. طراحی بی‌زمان و مقاوم در برابر زنگ‌زدگی و تغییر رنگ.',
    description_en:
      'A classic signet ring in polished silver-tone steel. Timeless design, resistant to rust and color change.',
    price: 215_000,
    category: 'rings',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(107), img(108)],
    isNew: false,
    isBestSeller: false,
    sizes: ['7', '8', '9', '10'],
    inStock: true,
  },

  // ────────────────── NECKLACES ──────────────────
  {
    id: 'necklace-001',
    slug: 'delicate-chain-necklace',
    title_fa: 'گردنبند زنجیر ظریف',
    title_en: 'Delicate Chain Necklace',
    description_fa:
      'گردنبند زنجیری ظریف با روکش نقره‌ای. طول قابل تنظیم، مناسب ست کردن با هر استایل. استیل ضدحساسیت و ضدزنگ.',
    description_en:
      'A delicate chain necklace with silver-tone finish. Adjustable length that complements any style. Hypoallergenic and rust-proof steel.',
    price: 195_000,
    category: 'necklaces',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(201), img(202), img(203)],
    isNew: false,
    isBestSeller: true,
    sizes: ['42cm', '45cm'],
    inStock: true,
  },
  {
    id: 'necklace-002',
    slug: 'pendant-heart-necklace',
    title_fa: 'گردنبند آویز قلب',
    title_en: 'Heart Pendant Necklace',
    description_fa:
      'گردنبند آویز طرح قلب با روکش طلایی. هدیه‌ای عاشقانه و ماندگار از جنس استیل ضدزنگ.',
    description_en:
      'A heart pendant necklace with gold-plated finish. A romantic, lasting gift made from rust-proof stainless steel.',
    price: 275_000,
    originalPrice: 320_000,
    category: 'necklaces',
    finish: 'gold-steel',
    trustTags: TRUST_TAGS,
    images: [img(204), img(205), img(206)],
    isNew: true,
    isBestSeller: false,
    sizes: ['42cm', '45cm', '50cm'],
    inStock: true,
  },
  {
    id: 'necklace-003',
    slug: 'layered-bar-necklace',
    title_fa: 'گردنبند لایه‌ای میله‌ای',
    title_en: 'Layered Bar Necklace',
    description_fa:
      'گردنبند لایه‌ای با آویز میله‌ای از استیل نقره‌ای. طراحی مدرن و ساده برای استایل روزمره.',
    description_en:
      'A layered necklace with bar pendant in silver-tone steel. Modern, simple design for everyday style.',
    price: 265_000,
    category: 'necklaces',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(207), img(208)],
    isNew: false,
    isBestSeller: true,
    sizes: ['45cm'],
    inStock: true,
  },
  {
    id: 'necklace-004',
    slug: 'snake-chain-choker',
    title_fa: 'چوکر زنجیر ماری',
    title_en: 'Snake Chain Choker',
    description_fa:
      'چوکر زنجیر ماری از استیل طلایی. طراحی جسورانه و شیک، مناسب مهمانی و مناسبت‌های خاص.',
    description_en:
      'A snake chain choker in gold-plated steel. Bold, chic design perfect for parties and special occasions.',
    price: 310_000,
    category: 'necklaces',
    finish: 'gold-steel',
    trustTags: TRUST_TAGS,
    images: [img(209), img(210)],
    isNew: true,
    isBestSeller: false,
    sizes: ['36cm', '40cm'],
    inStock: true,
  },

  // ────────────────── EARRINGS ──────────────────
  {
    id: 'earring-001',
    slug: 'mini-hoop-earrings',
    title_fa: 'گوشواره حلقه‌ای کوچک',
    title_en: 'Mini Hoop Earrings',
    description_fa:
      'گوشواره حلقه‌ای کوچک از استیل نقره‌ای. سبک و راحت برای استفاده روزانه. ضدحساسیت، مناسب پوست‌های حساس.',
    description_en:
      'Mini hoop earrings in silver-tone steel. Lightweight and comfortable for daily wear. Hypoallergenic, perfect for sensitive skin.',
    price: 145_000,
    category: 'earrings',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(301), img(302), img(303)],
    isNew: false,
    isBestSeller: true,
    sizes: [],
    inStock: true,
  },
  {
    id: 'earring-002',
    slug: 'drop-gold-earrings',
    title_fa: 'گوشواره آویز طلایی',
    title_en: 'Gold-Tone Drop Earrings',
    description_fa:
      'گوشواره آویز بلند با روکش طلایی. طراحی ظریف و زنانه با جنس استیل ضدزنگ و ضدحساسیت.',
    description_en:
      'Long drop earrings with gold-plated finish. Elegant, feminine design in rust-proof, hypoallergenic steel.',
    price: 198_000,
    originalPrice: 240_000,
    category: 'earrings',
    finish: 'gold-steel',
    trustTags: TRUST_TAGS,
    images: [img(304), img(305)],
    isNew: true,
    isBestSeller: false,
    sizes: [],
    inStock: true,
  },
  {
    id: 'earring-003',
    slug: 'stud-crystal-earrings',
    title_fa: 'گوشواره میخی کریستال',
    title_en: 'Crystal Stud Earrings',
    description_fa:
      'گوشواره میخی با نگین کریستال شفاف روی استیل نقره‌ای. ساده، درخشان و مناسب هر مناسبتی.',
    description_en:
      'Stud earrings with clear crystal stones set in silver-tone steel. Simple, sparkling, and suitable for any occasion.',
    price: 165_000,
    category: 'earrings',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(306), img(307)],
    isNew: false,
    isBestSeller: false,
    sizes: [],
    inStock: false,
  },

  // ────────────────── BRACELETS ──────────────────
  {
    id: 'bracelet-001',
    slug: 'cuff-bracelet-silver',
    title_fa: 'دستبند النگویی نقره‌ای',
    title_en: 'Silver-Tone Cuff Bracelet',
    description_fa:
      'دستبند النگویی باز از استیل نقره‌ای صیقلی. طراحی مدرن و ساده، قابل تنظیم روی مچ. ضدزنگ و ضدحساسیت.',
    description_en:
      'An open cuff bracelet in polished silver-tone steel. Modern, minimal design, adjustable on the wrist. Rust-proof and hypoallergenic.',
    price: 225_000,
    category: 'bracelets',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(401), img(402), img(403)],
    isNew: false,
    isBestSeller: true,
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: 'bracelet-002',
    slug: 'chain-link-bracelet-gold',
    title_fa: 'دستبند زنجیری طلایی',
    title_en: 'Gold-Tone Chain Link Bracelet',
    description_fa:
      'دستبند زنجیری با حلقه‌های درشت و روکش طلایی. ترکیبی از جسارت و ظرافت. استیل ضدزنگ با رنگ ثابت.',
    description_en:
      'A chain link bracelet with chunky links and gold-plated finish. A blend of boldness and elegance. Rust-proof steel with lasting color.',
    price: 285_000,
    originalPrice: 340_000,
    category: 'bracelets',
    finish: 'gold-steel',
    trustTags: TRUST_TAGS,
    images: [img(404), img(405)],
    isNew: true,
    isBestSeller: false,
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: 'bracelet-003',
    slug: 'bangle-set-mixed',
    title_fa: 'ست النگو ترکیبی',
    title_en: 'Mixed Bangle Set',
    description_fa:
      'ست سه‌تایی النگوی باریک شامل دو نقره‌ای و یک طلایی. از استیل ضدزنگ و ضدحساسیت. لایه‌بندی آسان.',
    description_en:
      'A set of three slim bangles — two silver-tone and one gold-plated. Rust-proof, hypoallergenic steel. Easy to layer.',
    price: 345_000,
    category: 'bracelets',
    finish: 'silver-steel',
    trustTags: TRUST_TAGS,
    images: [img(406), img(407), img(408)],
    isNew: false,
    isBestSeller: true,
    sizes: ['M', 'L'],
    inStock: true,
  },
]

// ─── Derived look-ups ─────────────────────────────────────────────────────────

/** Get a product by its slug. Returns undefined if not found. */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

/** Get a product by its id. Returns undefined if not found. */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

/** Get all products in a category. */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category)
}

/** Get all best-seller products. */
export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller)
}

/** Get all new products. */
export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew)
}

/** All available categories. */
export const categories: { key: ProductCategory; slug: string }[] = [
  { key: 'rings', slug: 'rings' },
  { key: 'necklaces', slug: 'necklaces' },
  { key: 'earrings', slug: 'earrings' },
  { key: 'bracelets', slug: 'bracelets' },
]
