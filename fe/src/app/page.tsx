'use client'
import { useAuthStore } from '@/store/AuthStore'

export default function Home() {
  const me = useAuthStore((state) => state.me)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p className="text-black">{me?.uid}</p>
    </main>
  )
}
