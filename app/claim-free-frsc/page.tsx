'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GlassCard } from '@/components/ui/GlassCard'
import { useFRSC } from '@/contexts/FRSCContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { completeReward, getRemainingCooldown } from '@/lib/rewards'
import { useLang } from '@/hooks/useLang'
import { Sparkles, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react'

const content = {
  id: {
    badge: 'Klaim FRSC Gratis',
    title: 'Dapatkan +1 FRSC Gratis',
    desc: 'Tonton sponsor di bawah, lalu dapatkan +1 FRSC gratis.',
    seconds: 'd',
    claimed: '+1 FRSC Berhasil Diklaim!',
    redirect: 'Mengalihkan...',
    back: 'Kembali',
    alreadyClaimed: 'Kamu sudah mengklaim hari ini. Silakan kembali nanti.',
    loginRequired: 'Silakan masuk terlebih dahulu.',
    loggingIn: 'Mengalihkan...',
  },
  en: {
    badge: 'Claim Free FRSC',
    title: 'Get +1 Free FRSC',
    desc: 'Watch the sponsor below, then get +1 FRSC free.',
    seconds: 's',
    claimed: '+1 FRSC Successfully Claimed!',
    redirect: 'Redirecting...',
    back: 'Back',
    alreadyClaimed: 'You already claimed today. Please come back later.',
    loginRequired: 'Please log in first.',
    loggingIn: 'Redirecting...',
  },
}

export default function ClaimFreeFRSCPage() {
  const { user, signIn } = useAuthContext()
  const { addCoin } = useFRSC()
  const router = useRouter()
  const { lang } = useLang()
  const c = content[lang] ?? content.id

  const [seconds, setSeconds] = useState(15)
  const [giftCompleted, setGiftCompleted] = useState(false)
  const [giftClaimed, setGiftClaimed] = useState(false)
  const [redirecting, setRedirecting] = useState<'cooldown' | 'login' | null>(null)

  useEffect(() => {
    if (!user) {
      setRedirecting('login')
      const t = setTimeout(() => signIn(), 1500)
      return () => clearTimeout(t)
    }
    if (getRemainingCooldown() > 0) {
      setRedirecting('cooldown')
    }
  }, [user, signIn])

  useEffect(() => {
    if (redirecting || !user) return
    const alreadyOpened = sessionStorage.getItem('wf_reward_opened')
    if (!alreadyOpened) {
      sessionStorage.setItem('wf_reward_opened', '1')
      window.open('https://discord.com/invite/SCDFEbRpjm', '_blank', 'noopener,noreferrer')
    }
  }, [redirecting, user])

  useEffect(() => {
    if (redirecting || seconds <= 0 || giftCompleted) return
    const timer = setTimeout(() => setSeconds((p) => p - 1), 1000)
    return () => clearTimeout(timer)
  }, [redirecting, seconds, giftCompleted])

  useEffect(() => {
    if (redirecting || seconds !== 0 || giftCompleted) return
    const claim = async () => {
      await addCoin()
      completeReward()
      sessionStorage.setItem('frsc_just_claimed', '1')
      setGiftCompleted(true)
      setTimeout(() => {
        setGiftClaimed(true)
        setTimeout(() => router.push('/rewards'), 3000)
      }, 500)
    }
    claim()
  }, [redirecting, seconds, giftCompleted, addCoin, router])

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-14">
        <div className="w-full max-w-lg">
          <GlassCard
            variant="premium"
            blur="medium"
            withReflection
            withAccent="crimson"
            withShimmer={!giftCompleted && !redirecting}
            className="p-8 text-center sm:p-10"
          >
            <div className="relative z-[2]">
              {redirecting === 'cooldown' ? (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                    <Sparkles className="h-8 w-8 text-frsc-text-300/50" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-frsc-text-200">
                    {c.alreadyClaimed}
                  </h2>
                  <Link
                    href="/rewards"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-frsc-text-300/60 transition-colors hover:text-frsc-text-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {c.back}
                  </Link>
                </>
              ) : redirecting === 'login' ? (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                    <Loader2 className="h-8 w-8 animate-spin text-frsc-crimson-400" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-frsc-text-200">
                    {c.loginRequired}
                  </h2>
                  <p className="mt-2 text-sm text-frsc-text-300/60">
                    {c.loggingIn}
                  </p>
                </>
              ) : !giftCompleted ? (
                <>
                  <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    {c.badge}
                  </span>
                  <h1 className="heading-fluid text-h2 text-frsc-white-bright text-balance">
                    {c.title}
                  </h1>
                  <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-frsc-text-200">
                    {c.desc}
                  </p>

                  <div className="mt-6">
                    <span className="font-heading text-7xl font-bold tracking-tight text-frsc-crimson-400 tabular-nums sm:text-8xl">
                      {seconds}
                    </span>
                    <span className="ml-1 text-lg text-frsc-text-300/50">{c.seconds}</span>
                  </div>

                  <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-frsc-crimson-600 to-frsc-crimson-400 transition-all duration-1000 ease-linear"
                      style={{ width: `${((15 - seconds) / 15) * 100}%` }}
                    />
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div
                      className="flex items-center justify-center rounded-xl border border-dashed border-frsc-surface-600/40 bg-frsc-surface-800/20"
                      style={{ width: '70%', minHeight: 90 }}
                    >
                      <span className="text-[10px] text-frsc-text-300/30">AdSpace</span>
                    </div>
                  </div>
                </>
              ) : !giftClaimed ? (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 ring-1 ring-green-500/30">
                    <Sparkles className="h-8 w-8 text-green-400" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-green-400">
                    {c.claimed}
                  </h2>
                  <p className="mt-2 text-sm text-frsc-text-200">
                    {c.redirect}
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-frsc-crimson-700/30">
                    <CheckCircle className="h-8 w-8 text-frsc-crimson-400" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-frsc-white-bright">
                    {c.claimed}
                  </h2>
                  <p className="mt-2 text-sm text-frsc-text-200">
                    {c.redirect}
                  </p>
                </>
              )}
            </div>
          </GlassCard>

          {!redirecting && !giftClaimed && (
            <div className="mt-6 text-center">
              <Link
                href="/rewards"
                className="inline-flex items-center gap-2 text-sm text-frsc-text-300/60 transition-colors hover:text-frsc-text-200"
              >
                <ArrowLeft className="h-4 w-4" />
                {c.back}
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
