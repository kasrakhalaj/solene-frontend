import { getDictionary } from '@/app/[locale]/dictionaries'
import Image from 'next/image'

interface AboutPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function AboutPage(props: AboutPageProps) {
  const params = await props.params;
  const locale = params.locale as 'en' | 'fa';
  const dict = await getDictionary()

  return (
    <main className="min-h-screen py-12 lg:py-24 px-4 lg:px-16 w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-semibold text-brand-text mb-4">
          {dict.about.title}
        </h1>
        <p className="text-xl text-brand-muted max-w-2xl">
          {dict.about.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-brand-cream">
          <Image
            src="https://picsum.photos/seed/soleneabout/800/1000"
            alt={dict.about.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        
        <div className="space-y-6 text-lg text-brand-muted leading-relaxed">
          <p>
            {dict.home.brandStoryText}
          </p>
          <p>
            {locale === 'fa' 
              ? 'تیم سولن با افتخار تلاش می‌کند تا زیباترین طراحی‌های روز دنیا را با قیمتی مناسب و کیفیتی ماندگار در اختیار شما قرار دهد. محصولات ما برای استفاده مداوم طراحی شده‌اند تا بدون نگرانی از تغییر رنگ یا حساسیت، در تمام لحظات همراه شما باشند.'
              : 'The Solene team proudly strives to bring you the most beautiful, contemporary designs at an affordable price with lasting quality. Our products are designed for continuous wear, ensuring they remain by your side in every moment without the worry of tarnishing or skin irritation.'}
          </p>
        </div>
      </div>
    </main>
  )
}
