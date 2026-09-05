'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const { user, signIn, loading, authError } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-frsc-crimson-500" />
      </div>
    )
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm transition-all duration-300 group-hover:from-frsc-crimson-800/35 group-hover:to-frsc-purple-800/25">
          <Sparkles className="h-5 w-5 text-frsc-crimson-400" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight text-frsc-white-bright">Farisium</span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 shadow-metallic glass-edge-highlight">
        <h1 className="heading-fluid text-h3 mb-1 text-frsc-white-bright">Masuk ke Farisium</h1>
        <p className="mb-8 text-pretty text-sm text-frsc-text-200">
          Masuk untuk mengakses semua layanan AI, klaim reward, dan lebih banyak lagi.
        </p>

        {authError && (
          <div role="alert" className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {authError}
          </div>
        )}

        <button
          type="button"
          onClick={signIn}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] py-3 text-sm font-semibold text-white shadow-metallic transition-all duration-200 hover:border-frsc-crimson-500/30 hover:from-frsc-crimson-900/10 hover:to-transparent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
        >
          {/* Google icon */}
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Masuk dengan Google
        </button>

        <p className="mt-6 text-center text-xs text-frsc-text-200">
          Dengan masuk, kamu menyetujui{' '}
          <Link href="/terms" className="text-frsc-crimson-400 hover:underline">Syarat & Ketentuan</Link>
          {' '}dan{' '}
          <Link href="/privacy" className="text-frsc-crimson-400 hover:underline">Kebijakan Privasi</Link>{' '}
          Farisium.
        </p>
      </div>
    </main>
  )
}
