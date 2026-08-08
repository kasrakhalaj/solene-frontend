import { getDictionary } from '@/app/[locale]/dictionaries'
import { LoginClient } from './LoginClient'
import { Suspense } from 'react'

export default async function LoginPage() {
  const dict = await getDictionary()

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[420px]">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginClient dict={dict} />
        </Suspense>
      </div>
    </main>
  )
}
