'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Gift,
  Coins,
  Sparkles,
  CheckCircle,
  Award,
  Zap,
  Gamepad2,
  ShoppingBag,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { GlassCard } from '@/components/ui/GlassCard'
import { useFRSC } from '@/contexts/FRSCContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { useLang } from '@/hooks/useLang'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

interface RewardItem {
  id: string
  icon: typeof Award
  name: { id: string; en: string }
  desc: { id: string; en: string }
  price: number
}

const rewards: RewardItem[] = [
  {
    id: 'role-discord',
    icon: Award,
    name: { id: 'Role Discord Eksklusif', en: 'Discord Exclusive Role' },
    desc: { id: 'Role eksklusif di server komunitas Discord Farisium', en: 'Exclusive role in the Farisium Discord community' },
    price: 5,
  },
  {
    id: 'steam-5',
    icon: Gamepad2,
    name: { id: 'Steam Voucher $5', en: 'Steam Voucher $5' },
    desc: { id: 'Voucher Steam senilai $5 untuk koleksi game kamu', en: '$5 Steam voucher for your game collection' },
    price: 15,
  },
  {
    id: 'googleplay-5',
    icon: ShoppingBag,
    name: { id: 'Google Play Voucher $5', en: 'Google Play Voucher $5' },
    desc: { id: 'Voucher Google Play untuk aplikasi dan game Android', en: 'Google Play voucher for Android apps and games' },
    price: 15,
  },
  {
    id: 'gens-50',
    icon: Sparkles,
    name: { id: '50 AI Generations', en: '50 AI Generations' },
    desc: { id: 'Tambahan 50 kali generate untuk semua AI Tools Farisium', en: '50 extra generations for all Farisium AI Tools' },
    price: 20,
  },
  {
    id: 'badge-profile',
    icon: Gift,
    name: { id: 'Profile Badge Eksklusif', en: 'Exclusive Profile Badge' },
    desc: { id: 'Badge khusus yang muncul di profil Farisium kamu', en: 'Special badge displayed on your Farisium profile' },
    price: 25,
  },
  {
    id: 'early-access',
    icon: Zap,
    name: { id: 'Early Access Pass', en: 'Early Access Pass' },
    desc: { id: 'Akses awal ke fitur dan AI Tools sebelum rilis publik', en: 'Early access to features and AI Tools before public release' },
    price: 35,
  },
]

const content = {
  id: {
    badge: 'Reward Center',
    title: 'Tukarkan FRSC',
    subtitle: 'Gunakan FRSC yang kamu kumpulkan untuk menukarkan berbagai hadiah eksklusif.',
    balance: 'Saldo FRSC',
    redeem: 'Tukarkan',
    insufficient: 'FRSC tidak cukup',
    success: 'Berhasil ditukarkan!',
    loginPrompt: 'Masuk untuk menukarkan hadiah',
    login: 'Masuk',
    footer: 'Hadiah akan diproses dalam 1x24 jam setelah penukaran.',
    emptyTitle: 'Belum ada hadiah',
    emptyDesc: 'Hadiah baru akan segera hadir. Pantau terus!',
  },
  en: {
    badge: 'Reward Center',
    title: 'Redeem FRSC',
    subtitle: 'Use the FRSC you have collected to redeem exclusive rewards.',
    balance: 'FRSC Balance',
    redeem: 'Redeem',
    insufficient: 'Insufficient FRSC',
    success: 'Successfully redeemed!',
    loginPrompt: 'Sign in to redeem rewards',
    login: 'Sign In',
    footer: 'Rewards will be processed within 1x24 hours after redemption.',
    emptyTitle: 'No rewards yet',
    emptyDesc: 'New rewards coming soon. Stay tuned!',
  },
}

export default function RewardPage() {
  const { coins, loading: coinsLoading, addCoins } = useFRSC()
  const { user, loading: authLoading, signIn } = useAuthContext()
  const { lang } = useLang()
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set())

  const c = content[lang] ?? content.id

  async function handleRedeem(item: RewardItem) {
    if (!user || coins < item.price || redeeming) return

    setRedeeming(item.id)
    try {
      await addCoins(-item.price)
      setRedeemed((prev) => new Set(prev).add(item.id))
    } catch {
      // silent
    } finally {
      setRedeeming(null)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-frsc-crimson-500/8 blur-3xl" />
            <div className="absolute -right-40 top-1/4 h-72 w-72 rounded-full bg-frsc-purple-500/5 blur-3xl" />
          </div>

          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
                <Gift className="h-3 w-3" aria-hidden="true" />
                {c.badge}
              </span>
              <h1 className="heading-fluid text-h1 text-frsc-white-bright text-balance">
                {c.title}
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
                {c.subtitle}
              </p>
            </div>

            {/* Balance pill */}
            <GlassCard
              variant="subtle"
              blur="light"
              withReflection={false}
              withAccent="crimson"
              className="flex items-center gap-3 px-5 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/15 ring-1 ring-frsc-crimson-700/30">
                <Image
                  src="/farisium-coin.png"
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px]"
                />
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wider uppercase text-frsc-text-300/50">
                  {c.balance}
                </p>
                <p className="text-lg font-bold text-frsc-white-bright leading-none mt-0.5">
                  {coinsLoading ? (
                    <span className="inline-block h-5 w-16 animate-pulse rounded bg-white/[0.06]" />
                  ) : (
                    <>{coins.toLocaleString()} FRSC</>
                  )}
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* ── Reward Grid ── */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 lg:px-6">
          {!user ? (
            /* Login prompt */
            <GlassCard
              variant="default"
              blur="medium"
              withReflection={true}
              withAccent="crimson"
              className="p-10 text-center"
            >
              <div className="relative z-[2]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10">
                  <Coins className="h-7 w-7 text-frsc-crimson-400" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-frsc-white-bright">
                  {c.loginPrompt}
                </h2>
                <button
                  type="button"
                  onClick={signIn}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
                >
                  {c.login}
                </button>
              </div>
            </GlassCard>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rewards.map((item, i) => {
                  const Icon = item.icon
                  const isRedeemed = redeemed.has(item.id)
                  const isRedeeming = redeeming === item.id
                  const insufficient = coins < item.price

                  return (
                    <GlassCard
                      key={item.id}
                      variant={isRedeemed ? 'subtle' : 'default'}
                      blur="light"
                      withReflection={!isRedeemed}
                      withAccent={isRedeemed ? 'none' : 'crimson'}
                      className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} flex flex-col p-6 ${
                        isRedeemed ? 'opacity-50' : 'hover-lift'
                      }`}
                    >
                      <div className="relative z-[2] flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                          <Icon className="h-5 w-5 text-frsc-crimson-400" />
                        </div>
                        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
                          <Image
                            src="/farisium-coin.png"
                            alt=""
                            width={16}
                            height={16}
                            className="h-3 w-3"
                          />
                          <span className="text-xs font-semibold text-frsc-white-bright">
                            {item.price}
                          </span>
                        </div>
                      </div>

                      <div className="relative z-[2] mt-4 flex-1">
                        <h3 className="font-heading text-base font-semibold text-frsc-white-bright">
                          {item.name[lang]}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-frsc-text-200">
                          {item.desc[lang]}
                        </p>
                      </div>

                      <div className="relative z-[2] mt-5">
                        {isRedeemed ? (
                          <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 py-2.5 text-sm font-medium text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            {c.success}
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={insufficient || isRedeeming}
                            onClick={() => handleRedeem(item)}
                            className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/40 disabled:cursor-not-allowed ${
                              insufficient
                                ? 'border border-white/[0.06] bg-white/[0.02] text-frsc-text-300/50'
                                : 'bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] text-white hover:bg-[length:100%_100%] hover:shadow-[0_0_20px_rgba(224,48,78,0.3)]'
                            }`}
                          >
                            {isRedeeming ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ...
                              </span>
                            ) : insufficient ? (
                              c.insufficient
                            ) : (
                              c.redeem
                            )}
                          </button>
                        )}
                      </div>
                    </GlassCard>
                  )
                })}
              </div>

              <p className="mt-8 text-center text-xs text-frsc-text-300/40">
                {c.footer}
              </p>
            </>
          )}
        </section>
      </main>

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
