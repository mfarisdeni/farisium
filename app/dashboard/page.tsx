'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFRSC } from '@/contexts/FRSCContext'
import { useUserStats } from '@/hooks/useUserStats'
import { getUserClaims, type ClaimData } from '@/lib/claims'
import { getUserFStreamBoostOrders, type FStreamBoostOrder } from '@/lib/fStreamBoost'
import { FStreamBoostOrderCard } from '@/components/dashboard/FStreamBoostOrderCard'
import {
  LayoutDashboard,
  Coins,
  Wand2,
  ArrowRight,
  Gift,
  ShoppingBag,
  Headphones,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { useLang } from '@/hooks/useLang'
import { ScrollReveal } from '@/components/scroll-reveal'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

const content = {
  id: {
    loginTitle: 'Dashboard',
    loginDesc: 'Masuk untuk mengakses dashboard dan melihat aktivitas akunmu.',
    loginButton: 'Masuk dengan Google',
    greeting: 'Halo',
    balanceLabel: 'Saldo FRSC',
    generateLabel: 'Total Generate',
    quickLinks: [
      { label: 'Klaim Daily Reward', href: '/rewards', desc: 'Dapatkan FRSC gratis setiap hari' },
      { label: 'Struk Belanja ke Excel', href: '/ai/receipt-to-excel', desc: 'Konversi foto struk belanja ke Excel otomatis' },
      { label: 'Foto ke Invoice', href: '/ai/image-to-invoice', desc: 'Ubah foto invoice jadi PDF & Excel profesional' },
      { label: 'F-Stream Boost Spotify', href: '/ai/f-stream-spotify-promotion', desc: 'Tingkatkan streaming Spotify-mu' },
      { label: 'Pelajari FRSC', href: '/frsc', desc: 'Cara mendapatkan dan menggunakan FRSC' },
      { label: 'Jelajahi AI Tools', href: '/ai', desc: 'Lihat semua layanan AI tersedia' },
      { label: 'Riwayat Top-Up', href: '/payment-logs', desc: 'Lihat log transaksi FRSC' },
    ],
    rewardsTitle: 'Rewards Saya',
    rewardsEmpty: 'Belum ada reward yang diklaim.',
    rewardsCta: 'Tukarkan FRSC',
    claimedLabel: 'Diklaim',
    musicOrdersTitle: 'Music Promotion Orders',
    musicOrdersEmpty: 'No F-Stream Boost orders yet.',
  },
  en: {
    loginTitle: 'Dashboard',
    loginDesc: 'Sign in to access your dashboard and view your account activity.',
    loginButton: 'Sign in with Google',
    greeting: 'Hello',
    balanceLabel: 'FRSC Balance',
    generateLabel: 'Total Generations',
    quickLinks: [
      { label: 'Claim Daily Reward', href: '/rewards', desc: 'Earn free FRSC every day' },
      { label: 'Image Receipt to Excel', href: '/ai/receipt-to-excel', desc: 'Turn shopping receipt photos into Excel automatically' },
      { label: 'Image to Invoice', href: '/ai/image-to-invoice', desc: 'Turn invoice photos into professional PDF & Excel' },
      { label: 'F-Stream Boost Spotify', href: '/ai/f-stream-spotify-promotion', desc: 'Boost your Spotify streaming' },
      { label: 'Learn about FRSC', href: '/frsc', desc: 'How to earn and use FRSC' },
      { label: 'Explore AI Tools', href: '/ai', desc: 'See all available AI services' },
      { label: 'Top-Up History', href: '/payment-logs', desc: 'View FRSC transaction logs' },
    ],
    rewardsTitle: 'My Rewards',
    rewardsEmpty: 'No rewards claimed yet.',
    rewardsCta: 'Redeem FRSC',
    claimedLabel: 'Claimed',
    musicOrdersTitle: 'Music Promotion Orders',
    musicOrdersEmpty: 'No F-Stream Boost orders yet.',
  },
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export default function DashboardPage() {
  const { user, signIn, loading } = useAuthContext()
  const { coins } = useFRSC()
  const { generations } = useUserStats()
  const { lang } = useLang()
  const c = content[lang] ?? content.id

  const [claims, setClaims] = useState<ClaimData[]>([])
  const [claimsLoading, setClaimsLoading] = useState(true)
  const [orders, setOrders] = useState<FStreamBoostOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setClaimsLoading(false)
      setOrdersLoading(false)
      return
    }
    getUserClaims(user.uid).then((data) => {
      setClaims(data)
      setClaimsLoading(false)
    })
    getUserFStreamBoostOrders(user.uid).then((data) => {
      setOrders(data)
      setOrdersLoading(false)
    })
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-frsc-crimson-500" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 text-center shadow-metallic">
            <LayoutDashboard className="mx-auto mb-4 h-12 w-12 text-frsc-crimson-500/50" />
            <h1 className="font-heading text-xl font-bold text-frsc-white-bright">{c.loginTitle}</h1>
            <p className="mt-2 text-sm text-frsc-text-200">
              {c.loginDesc}
            </p>
            <button
              type="button"
              onClick={signIn}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
            >
              {c.loginButton}
            </button>
          </div>
        </main>
      <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          {/* Profile header */}
          <div className="mb-8 flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName ?? ''} loading="lazy" className="h-14 w-14 rounded-full object-cover ring-2 ring-frsc-crimson-500/30" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/40 to-frsc-purple-800/20 font-heading text-xl font-bold text-frsc-crimson-300 ring-1 ring-frsc-crimson-700/30">
                {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
              </div>
            )}
<div>
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{c.loginTitle}</span>
              <h1 className="heading-fluid text-h2 text-foreground mt-1">
                {c.greeting}, {user.displayName?.split(' ')[0] ?? 'User'}
              </h1>
              <p className="text-sm text-frsc-text-300">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="reveal-on-scroll reveal-stagger reveal-delay-1 hover-lift flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                <Coins className="h-6 w-6 text-frsc-crimson-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-frsc-text-200">{c.balanceLabel}</p>
                <p className="font-heading text-2xl font-bold text-frsc-white-bright">{coins}</p>
              </div>
            </div>

            <div className="reveal-on-scroll reveal-stagger reveal-delay-2 hover-lift flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                <Wand2 className="h-6 w-6 text-frsc-crimson-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-frsc-text-200">{c.generateLabel}</p>
                <p className="font-heading text-2xl font-bold text-frsc-white-bright">{generations ?? 0}</p>
              </div>
            </div>

            <Badge variant="crimson" size="md" className="reveal-on-scroll reveal-stagger reveal-delay-3 self-center justify-self-start lg:justify-self-end">
              <LayoutDashboard className="mr-1.5 h-3 w-3" aria-hidden="true" />
              Dashboard
            </Badge>
          </div>

          {/* Quick links */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.quickLinks.map(({ label, href, desc }, i) => (
              <Link
                key={href}
                href={href}
                className={`group reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift flex items-center justify-between rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-5 shadow-metallic`}
              >
                <div>
                  <p className="text-sm font-semibold text-frsc-white-bright">{label}</p>
                  <p className="mt-0.5 text-xs text-frsc-text-200">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-frsc-text-200 transition-transform group-hover:translate-x-0.5 group-hover:text-frsc-crimson-400" aria-hidden="true" />
              </Link>
            ))}
          </div>

          {/* ══════════════════════════════════════════
              MY REWARDS
              ══════════════════════════════════════════ */}
          <div id="my-rewards" className="mt-12 scroll-mt-20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-frsc-white-bright">
                  {c.rewardsTitle}
                </h2>
                {!claimsLoading && claims.length > 0 && (
                  <p className="mt-1 text-sm text-frsc-text-300/60">
                    {claims.length} {lang === 'id' ? 'reward diklaim' : 'rewards claimed'}
                  </p>
                )}
              </div>
              <Link
                href="/rewards"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-frsc-text-200 transition-all duration-300 hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-400 active:scale-[0.97]"
              >
                <Gift className="h-3.5 w-3.5" />
                {c.rewardsCta}
              </Link>
            </div>

            {claimsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-frsc-crimson-600/30 border-t-frsc-crimson-400" />
              </div>
            ) : claims.length === 0 ? (
              <GlassCard
                variant="subtle"
                blur="light"
                withReflection={false}
                className="p-8 text-center"
              >
                <div className="relative z-[2]">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/20 to-frsc-purple-800/10 ring-1 ring-white/10">
                    <ShoppingBag className="h-6 w-6 text-frsc-text-300/50" />
                  </div>
                  <p className="text-sm text-frsc-text-200">{c.rewardsEmpty}</p>
                </div>
              </GlassCard>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {claims.slice(0, 6).map((claim) => (
                  <GlassCard
                    key={claim.id}
                    variant="default"
                    blur="light"
                    withReflection={true}
                    withAccent="purple"
                    className="group hover-lift overflow-hidden !p-0 border-0"
                  >
                    <div className="relative z-[2] h-28 overflow-hidden">
                      {claim.bg ? (
                        <img src={claim.bg} alt={claim.name} loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-frsc-crimson-900/40 to-frsc-purple-900/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />

                      {claim.logo ? (
                        <div className="absolute left-2.5 top-2.5 z-20 h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-white shadow-lg">
                          <img src={claim.logo} alt={claim.partner} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="absolute left-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/60 to-frsc-purple-800/30 ring-1 ring-white/20 shadow-lg text-[10px] font-bold text-white">
                          {claim.partner[0]}
                        </div>
                      )}

                      <div className="absolute right-2.5 top-2.5 z-20 rounded-full border border-green-500/30 bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-400 backdrop-blur-sm">
                        <CheckCircle className="-mt-0.5 mr-0.5 inline h-2.5 w-2.5" />
                        {c.claimedLabel}
                      </div>
                    </div>

                    <div className="relative z-[2] p-3">
                      <h3 className="font-heading text-xs font-semibold text-frsc-white-bright truncate">
                        {claim.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Image src="/farisium-coin.png" alt="" width={16} height={16} className="h-4 w-4" />
                          <span className="text-[11px] font-bold text-frsc-crimson-400">
                            {claim.price.toLocaleString()} FRSC
                          </span>
                        </div>
                        <time className="text-[10px] text-frsc-text-300/40">
                          {claim.claimedAt.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════
              MUSIC PROMOTION ORDERS
              ══════════════════════════════════════════ */}
          <div id="music-orders" className="mt-12 scroll-mt-20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-frsc-white-bright">
                  {c.musicOrdersTitle}
                </h2>
                {!ordersLoading && orders.length > 0 && (
                  <p className="mt-1 text-sm text-frsc-text-300/60">
                    {orders.length} {lang === 'id' ? 'pesanan' : 'orders'}
                  </p>
                )}
              </div>
              <a
                href="/ai/f-stream-spotify-promotion"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-frsc-text-200 transition-all duration-300 hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-400 active:scale-[0.97]"
              >
                <Headphones className="h-3.5 w-3.5" />
                New Order
              </a>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-frsc-crimson-600/30 border-t-frsc-crimson-400" />
              </div>
            ) : orders.length === 0 ? (
              <GlassCard
                variant="subtle"
                blur="light"
                withReflection={false}
                className="p-8 text-center"
              >
                <div className="relative z-[2]">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/20 to-frsc-purple-800/10 ring-1 ring-white/10">
                    <Headphones className="h-6 w-6 text-frsc-text-300/50" />
                  </div>
                  <p className="text-sm text-frsc-text-200">{c.musicOrdersEmpty}</p>
                </div>
              </GlassCard>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                  <FStreamBoostOrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
