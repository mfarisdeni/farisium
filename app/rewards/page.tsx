'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { useFRSC } from '@/contexts/FRSCContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { getRemainingCooldown } from '@/lib/rewards'
import {
  Gift,
  Coins,
  Clock,
  ArrowRight,
  CheckCircle,
  Lock,
  Plus,
  AlertTriangle,
  X,
  Crown,
  Tag,
  Gem,
  Star,
  Zap,
  ShoppingBag,
  Smartphone,
} from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { saveClaim } from '@/lib/claims'


interface PartnerReward {
  id: string
  name: string
  price: number
  bg: string
  logo: string
  partner: string
  ticket: boolean
  category: 'discount' | 'accessories' | 'premium' | 'grand'
}

const partnerRewards: PartnerReward[] = [
  { id: 'pelitta-discount', name: '10% Discount Pelitta Mini Cafe', price: 200, bg: '/rewards/pelitta-discount-10.webp', logo: '', partner: 'Pelitta', ticket: false, category: 'discount' },
  { id: 'discount-20-pelitta', name: '20% Discount Pelitta Mini Cafe', price: 300, bg: '/rewards/pelitta-discount-20.webp', logo: '', partner: 'Pelitta', ticket: false, category: 'discount' },
  { id: 'pelitta-bogo', name: 'Buy 1 Get 1 Pelitta Mini Cafe', price: 400, bg: '/rewards/pelitta-buy-1-get-1.webp', logo: '', partner: 'Pelitta', ticket: true, category: 'discount' },
  { id: 'mouse-pad', name: 'Mouse Pad', price: 700, bg: '/rewards/mouse-pad.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'phone-holder', name: 'Phone Holder', price: 1000, bg: '/rewards/phone-holder.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'phone-cooler', name: 'Phone Cooler', price: 1500, bg: '/rewards/phone-cooler.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'charger-usbc', name: 'Charger USB-C', price: 2000, bg: '/rewards/charger-usbc.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'earpods', name: 'Apple EarPods USB-C', price: 4000, bg: '/rewards/earpods.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'bluetooth-speaker', name: 'Bluetooth Speaker', price: 6000, bg: '/rewards/bluetooth-speaker.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'mouse-gaming', name: 'Mouse Gaming', price: 7000, bg: '/rewards/mouse-gaming.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'keyboard-gaming', name: 'Keyboard Gaming', price: 10000, bg: '/rewards/keyboard-gaming.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'accessories' },
  { id: 'redmi-15c', name: 'Redmi 15C', price: 1000000, bg: '/rewards/redmi-15c.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'premium' },
  { id: 'samsung-a-series', name: 'Samsung A Series', price: 3500000, bg: '/rewards/samsung-a-series.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'premium' },
  { id: 'poco-x-series', name: 'Poco X Series', price: 2500000, bg: '/rewards/poco-x-series.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'premium' },
  { id: 'asus-rog-phone-9', name: 'ASUS ROG Phone 9', price: 7000000, bg: '/rewards/asus-rog-phone-9.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'premium' },
  { id: 'pc-gaming-rtx', name: 'PC Gaming RTX', price: 8000000, bg: '/rewards/pc-gaming-rtx.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'premium' },
  { id: 'gold-05g', name: 'Gold 0.5g', price: 500000, bg: '/rewards/gold-05g.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'grand' },
  { id: 'gold-1g', name: 'Gold 1g', price: 1000000, bg: '/rewards/gold-1gr.webp', logo: '', partner: 'Farisium', ticket: false, category: 'grand' },
  { id: 'gold-5g', name: 'Gold 5g', price: 5000000, bg: '/rewards/gold-5gr.webp', logo: '', partner: 'Farisium', ticket: false, category: 'grand' },
  { id: 'gold-10g', name: 'Gold 10g', price: 10000000, bg: '/rewards/gold-10gr.webp', logo: '', partner: 'Farisium', ticket: false, category: 'grand' },
  { id: 'iphone-17-pro', name: 'iPhone 17 Pro', price: 10000000, bg: '/rewards/iphone-17-pro.webp', logo: '', partner: 'Farisium', ticket: false, category: 'grand' },
  { id: 'honda-beat', name: 'Honda BeAT', price: 25000000, bg: '/rewards/honda-beat.jpg', logo: '', partner: 'Farisium', ticket: false, category: 'grand' },
  { id: 'yamaha-nmax', name: 'Yamaha NMAX', price: 45000000, bg: '/rewards/yamaha-nmax.webp', logo: '', partner: 'Farisium', ticket: false, category: 'grand' },
]

const FEATURED_GRAND_IDS = ['iphone-17-pro', 'gold-10g', 'yamaha-nmax']

const content = {
  id: {
    badge: 'Rewards',
    heading: 'Klaim FRSC',
    subheading: 'Dapatkan FRSC gratis setiap hari dan tukarkan dengan hadiah menarik dari partner kami.',
    balanceLabel: 'Saldo',
    partnerTitle: 'Partner Rewards',
    partnerDesc: 'Tukarkan FRSC kamu dengan voucher dan diskon dari partner Farisium.',
    rewards: [
      { id: 'daily', icon: Gift, title: 'Daily Reward', description: 'Klaim +1 FRSC gratis setiap 24 jam.', frsc: '+1 FRSC', type: 'daily' as const },
    ],
    claimed: '+1 FRSC berhasil diklaim!',
    cooldownLabel: 'Tersedia dalam',
    claimNow: 'Klaim Sekarang',
    claimLogin: 'Masuk untuk Klaim',
    ctaTitle: 'Pelajari lebih lanjut tentang FRSC',
    ctaDesc: 'Cara kerja, cara mendapatkan, dan cara menggunakan FRSC di ekosistem Farisium.',
    ctaLabel: 'Pelajari FRSC',
    insufficient: 'Saldo FRSC tidak mencukupi',
    modalTitle: 'Reward Berhasil Diklaim!',
    modalDesc: 'Reward sudah tercatat dan bisa kamu lihat kapan saja.',
    modalButton: 'Lihat Reward Saya',
  },
  en: {
    badge: 'Rewards',
    heading: 'Claim FRSC',
    subheading: 'Get free FRSC every day and redeem them for exciting rewards from our partners.',
    balanceLabel: 'Balance',
    partnerTitle: 'Partner Rewards',
    partnerDesc: 'Redeem your FRSC for vouchers and discounts from Farisium partners.',
    rewards: [
      { id: 'daily', icon: Gift, title: 'Daily Reward', description: 'Claim +1 free FRSC every 24 hours.', frsc: '+1 FRSC', type: 'daily' as const },
    ],
    claimed: '+1 FRSC successfully claimed!',
    cooldownLabel: 'Available in',
    claimNow: 'Claim Now',
    claimLogin: 'Login to Claim',
    ctaTitle: 'Learn more about FRSC',
    ctaDesc: 'How FRSC works, how to earn it, and how to use it across the Farisium ecosystem.',
    ctaLabel: 'Learn FRSC',
    insufficient: 'Insufficient FRSC balance',
    modalTitle: 'Reward Claimed!',
    modalDesc: 'Your reward has been recorded and you can view it anytime.',
    modalButton: 'View My Rewards',
  },
}

export default function RewardsPage() {
  const { user, signIn } = useAuthContext()
  const { coins, addCoins } = useFRSC()
  const router = useRouter()
  const { lang } = useLang()
  const c = content[lang] ?? content.id

  const [cooldown, setCooldown] = useState(0)
  const [justClaimed, setJustClaimed] = useState(false)
  const pendingClaimRef = useRef(false)

  const [claimingPartner, setClaimingPartner] = useState<string | null>(null)
  const [partnerMessage, setPartnerMessage] = useState<{
    id: string
    type: 'error'
    text: string
  } | null>(null)
  const [claimSuccessItem, setClaimSuccessItem] = useState<(typeof partnerRewards)[0] | null>(null)

  useEffect(() => {
    const update = () => setCooldown(getRemainingCooldown())
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('frsc_just_claimed') === '1') {
      sessionStorage.removeItem('frsc_just_claimed')
      setJustClaimed(true)
      const t = setTimeout(() => setJustClaimed(false), 4000)
      return () => clearTimeout(t)
    }
  }, [])

  const formatCooldown = (ms: number) => {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const units = lang === 'id' ? ['j', 'm', 'd'] : ['h', 'm', 's']
    return `${h}${units[0]} ${m}${units[1]} ${s}${units[2]}`
  }

  useEffect(() => {
    if (user && pendingClaimRef.current) {
      pendingClaimRef.current = false
      router.push('/claim-free-frsc')
    }
  }, [user, router])

  const handleDailyClaim = () => {
    if (!user) { pendingClaimRef.current = true; signIn(); return }
    router.push('/claim-free-frsc')
  }

  const handlePartnerClaim = async (item: (typeof partnerRewards)[0]) => {
    if (!user) { signIn(); return }
    if (claimingPartner) return

    if (coins < item.price) {
      setPartnerMessage({ id: item.id, type: 'error', text: c.insufficient })
      setTimeout(() => setPartnerMessage(null), 3000)
      return
    }

    setClaimingPartner(item.id)
    await addCoins(-item.price)
    saveClaim(user.uid, item).catch(() => {})
    setClaimingPartner(null)
    setClaimSuccessItem(item)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ══════════════════════════════════════════
            HERO
            ══════════════════════════════════════════ */}
        <section className="relative mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-frsc-crimson-500/6 blur-3xl" />
            <div className="absolute -right-40 top-1/4 h-72 w-72 rounded-full bg-frsc-purple-500/4 blur-3xl" />
          </div>

          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
                <Gift className="h-3 w-3" aria-hidden="true" />
                {c.badge}
              </span>
              <h1 className="heading-fluid text-h1 text-frsc-white-bright text-balance">
                {c.heading}
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
                {c.subheading}
              </p>
            </div>

            {user && (
              <GlassCard
                variant="subtle"
                blur="light"
                withReflection={false}
                withAccent="crimson"
                className="flex items-center gap-3 px-5 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/15 ring-1 ring-frsc-crimson-700/30">
                  <Image src="/farisium-coin.png" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wider uppercase text-frsc-text-300/50">
                    {c.balanceLabel}
                  </p>
                  <p className="text-lg font-bold text-frsc-white-bright leading-none mt-0.5">
                    {coins.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')} FRSC
                  </p>
                </div>
              </GlassCard>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BONUS FRSC
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.rewards.map(({ id, title, description, frsc, icon: Icon, type }) => (
              <GlassCard
                key={id}
                variant="default"
                blur="light"
                withReflection={true}
                withAccent="crimson"
                className="group hover-lift flex flex-col p-6 border border-frsc-crimson-500/20 transition-all duration-300 hover:border-frsc-crimson-500/40 hover:shadow-metallic-lg"
              >
                {/* Glow effect on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-frsc-crimson-500/10 to-frsc-purple-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative z-[2] flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/30 shadow-sm transition-all duration-300 group-hover:ring-frsc-crimson-500/50 group-hover:shadow-frsc-crimson-500/20">
                    <Icon className="h-5 w-5 text-frsc-crimson-400 transition-colors duration-300 group-hover:text-frsc-crimson-300" />
                  </div>
                  <Badge variant="crimson" size="sm">{frsc}</Badge>
                </div>

                <div className="relative z-[2] mt-4 flex-1">
                  <h3 className="font-heading text-base font-semibold text-frsc-white-bright transition-colors duration-300 group-hover:text-frsc-crimson-100">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-frsc-text-200">
                    {description}
                  </p>
                </div>

                <div className="relative z-[2] mt-auto pt-5">
                  {justClaimed ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 py-2.5 text-sm font-medium text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      {c.claimed}
                    </div>
                  ) : cooldown > 0 ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-sm text-frsc-text-200 backdrop-blur-sm">
                      <Clock className="h-4 w-4" />
                      {c.cooldownLabel} {formatCooldown(cooldown)}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDailyClaim}
                      className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-2.5 text-sm font-semibold text-white shadow-lg shadow-frsc-crimson-900/30 transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
                    >
                      {user ? c.claimNow : c.claimLogin}
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PARTNER REWARDS
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="kicker mb-3">
                <span className="kicker-line" aria-hidden="true" />
                Rewards
              </span>
              <h2 className="heading-fluid text-h2 text-frsc-white-bright text-balance">
                {c.partnerTitle}
              </h2>
              <p className="mt-2 max-w-lg text-pretty text-sm text-frsc-text-200">
                {c.partnerDesc}
              </p>
            </div>
            <Link
              href="/dashboard#my-rewards"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-frsc-text-200 transition-all duration-300 hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-400 active:scale-[0.97]"
            >
              <Gift className="h-3.5 w-3.5" />
              {lang === 'id' ? 'Rewards Saya' : 'My Rewards'}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {(() => {
            const grand = partnerRewards.filter(r => r.category === 'grand')
            const featuredGrand = grand.filter(r => FEATURED_GRAND_IDS.includes(r.id))
            const otherGrand = grand.filter(r => !FEATURED_GRAND_IDS.includes(r.id))
            const discount = partnerRewards.filter(r => r.category === 'discount')
            const accessories = partnerRewards.filter(r => r.category === 'accessories')
            const premium = partnerRewards.filter(r => r.category === 'premium')

            const emojiIcon = (cat: PartnerReward['category']) => {
              if (cat === 'discount') return <Tag className="h-5 w-5" />
              if (cat === 'accessories') return <ShoppingBag className="h-5 w-5" />
              if (cat === 'premium') return <Smartphone className="h-5 w-5" />
              return <Crown className="h-5 w-5" />
            }

            const categoryColors: Record<PartnerReward['category'], { ring: string; bg: string; text: string }> = {
              discount: { ring: 'ring-white/20', bg: 'from-frsc-crimson-800/60 to-frsc-purple-800/30', text: 'text-frsc-crimson-300' },
              accessories: { ring: 'ring-white/20', bg: 'from-frsc-crimson-800/60 to-frsc-purple-800/30', text: 'text-frsc-crimson-300' },
              premium: { ring: 'ring-amber-400/30', bg: 'from-amber-500/40 to-amber-600/20', text: 'text-amber-400' },
              grand: { ring: 'ring-[#ffbf00]/40', bg: 'from-[#ffbf00]/30 to-[#ffcf40]/15', text: 'text-[#ffcf40]' },
            }

            const categoryLabel: Record<PartnerReward['category'], string> = {
              discount: lang === 'id' ? 'Diskon' : 'Discount',
              accessories: lang === 'id' ? 'Aksesoris' : 'Accessories',
              premium: 'Premium',
              grand: 'Grand Prize',
            }

            const renderCard = (item: PartnerReward, borderClass: string, isFeatured = false) => {
              const isClaiming = claimingPartner === item.id
              const msg = partnerMessage?.id === item.id ? partnerMessage : null
              const colors = categoryColors[item.category]

              return (
                <GlassCard
                  key={item.id}
                  variant="default"
                  blur={isFeatured ? 'medium' : 'light'}
                  withReflection={true}
                  withAccent={isFeatured ? 'purple' : 'crimson'}
                  className={cn(
                    'group hover-lift !p-0',
                    borderClass,
                    isFeatured && 'reward-border-grand-glow',
                    msg && 'ring-1 ring-red-500/40',
                  )}
                >
                  <div className="relative z-[2] h-40 overflow-hidden">
                    <img
                      src={item.bg}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Image overlay gradients */}
                    <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-transparent via-transparent to-black/40" />

                    {/* Category icon */}
                    <div
                      className={cn(
                        'absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-black/40',
                        colors.bg,
                        colors.ring,
                        'ring-1',
                      )}
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.23)' }}
                    >
                      <span className={colors.text}>{emojiIcon(item.category)}</span>
                    </div>

                    {/* Category badge */}
                    <div className="absolute right-3 top-3 z-20">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-sm',
                          item.category === 'grand' && 'text-[#ffcf40] border border-[#ffbf00]/30',
                          item.category === 'premium' && 'text-amber-300 border border-amber-400/30',
                          (item.category === 'discount' || item.category === 'accessories') && 'text-white/80 border border-white/20',
                        )}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.38)' }}
                      >
                        {categoryLabel[item.category]}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-[2] p-4">
                    {item.ticket && (
                      <>
                        <div className="absolute -right-3 top-6 h-5 w-5 rounded-full bg-[#0a0a0a]" />
                        <div className="absolute -right-3 bottom-6 h-5 w-5 rounded-full bg-[#0a0a0a]" />
                        <div className="absolute right-0 top-0 h-px w-6 bg-gradient-to-l from-white/[0.06] to-transparent" />
                        <div className="absolute right-0 bottom-0 h-px w-6 bg-gradient-to-l from-white/[0.06] to-transparent" />
                      </>
                    )}

                    <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">
                      {item.name}
                    </h3>

                    {msg ? (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 backdrop-blur-sm">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1">{msg.text}</span>
                        <button type="button" onClick={() => setPartnerMessage(null)} className="shrink-0 cursor-pointer opacity-60 hover:opacity-100">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Image src="/farisium-coin.png" alt="" width={16} height={16} className="h-4 w-4" />
                          <span className={cn(
                            'text-sm font-bold',
                            item.category === 'grand' ? 'text-[#ffcf40]' : item.category === 'premium' ? 'text-amber-400' : 'text-frsc-crimson-400',
                          )}>
                            {item.price.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')} FRSC
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePartnerClaim(item)}
                          disabled={isClaiming || !user}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800 to-frsc-purple-800 text-white shadow-lg shadow-frsc-crimson-900/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(224,48,78,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 active:scale-[0.92]"
                        >
                          {isClaiming ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )
            }

            const sectionHeading = (label: string, color: 'silver' | 'gold' | 'grand' = 'silver') => {
              const lineColors = {
                silver: 'bg-gradient-to-r from-white/15 via-white/5 to-transparent',
                gold: 'bg-gradient-to-r from-amber-400/35 via-amber-400/15 to-transparent',
                grand: 'bg-gradient-to-r from-[#ffbf00]/50 via-[#ffcf40]/25 to-transparent',
              }
              const textColors = {
                silver: 'text-white/50',
                gold: 'text-amber-400/70',
                grand: 'text-[#ffcf40]/80',
              }
              return (
                <div className="mb-4 mt-10 first:mt-0">
                  <div className="flex items-center gap-3">
                    <span className="kicker">
                      <span className={cn('h-px w-6 rounded-full', lineColors[color])} aria-hidden="true" />
                      {label}
                    </span>
                    <div className={cn('h-px flex-1', lineColors[color])} />
                  </div>
                </div>
              )
            }

            return (
              <>
                {/* ── Featured Grand Prize ── */}
                {featuredGrand.length > 0 && (
                  <div className="relative mb-10 overflow-hidden glass-base-light glass-shadow rounded-xl border-opacity-50 p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] rounded-inherit glass-reflection" />
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ffbf00]/6 blur-3xl" />
                    <div className="relative z-[2] mb-5 flex items-center gap-2.5 px-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffbf00]/25 to-[#ffcf40]/10 ring-1 ring-[#ffbf00]/30">
                        <Crown className="h-4 w-4 text-[#ffbf00]" />
                      </div>
                      <span className="text-sm font-bold tracking-wider text-[#ffcf40] uppercase">Grand Prize</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#ffbf00]/20 to-transparent" />
                    </div>
                    <div className="relative z-[2] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredGrand.map(item => renderCard(item, 'reward-border-grand', true))}
                    </div>
                  </div>
                )}

                {/* ── Discount ── */}
                {discount.length > 0 && (
                  <>
                    {sectionHeading(lang === 'id' ? 'Discount' : 'Discount', 'silver')}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {discount.map(item => renderCard(item, 'reward-border-bronze'))}
                    </div>
                  </>
                )}

                {/* ── Accessories ── */}
                {accessories.length > 0 && (
                  <>
                    {sectionHeading(lang === 'id' ? 'Accessories' : 'Accessories', 'silver')}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {accessories.map(item => renderCard(item, 'reward-border-bronze'))}
                    </div>
                  </>
                )}

                {/* ── Premium Rewards ── */}
                {premium.length > 0 && (
                  <>
                    {sectionHeading(lang === 'id' ? 'Premium Rewards' : 'Premium Rewards', 'gold')}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {premium.map(item => renderCard(item, 'reward-border-silver'))}
                    </div>
                  </>
                )}

                {/* ── Grand Prize ── */}
                {otherGrand.length > 0 && (
                  <>
                    {sectionHeading(lang === 'id' ? 'Grand Prize' : 'Grand Prize', 'grand')}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {otherGrand.map(item => renderCard(item, 'reward-border-grand'))}
                    </div>
                  </>
                )}
              </>
            )
          })()}
        </section>

        {/* ══════════════════════════════════════════
            CTA
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 lg:px-6">
          <GlassCard
            variant="default"
            blur="light"
            withReflection={true}
            withAccent="crimson"
            className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-metallic-lg sm:p-8"
          >
            <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-frsc-crimson-500/5 via-transparent to-frsc-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-[2] flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h3 className="font-heading text-base font-semibold text-frsc-white-bright">
                  {c.ctaTitle}
                </h3>
                <p className="mt-1 text-sm text-frsc-text-200">
                  {c.ctaDesc}
                </p>
              </div>
              <Link
                href="/frsc"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_20px_rgba(224,48,78,0.3)] active:scale-[0.97]"
              >
                {c.ctaLabel} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </GlassCard>
        </section>

        {/* ══════════════════════════════════════════
            SUCCESS MODAL
            ══════════════════════════════════════════ */}
        {claimSuccessItem && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setClaimSuccessItem(null)}
              aria-hidden="true"
            />

            <GlassCard
              variant="premium"
              blur="strong"
              withReflection
              withAccent="crimson"
              className="relative z-10 w-full max-w-sm border border-white/10 p-6 shadow-2xl animate-fade-in sm:p-8"
            >
              <button
                type="button"
                onClick={() => setClaimSuccessItem(null)}
                className="absolute right-3 top-3 z-20 cursor-pointer rounded-lg p-1.5 text-frsc-text-300/50 transition-colors hover:text-frsc-text-200"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative z-[2] text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 ring-1 ring-green-500/30">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>

                <h2 className="font-heading text-lg font-semibold text-frsc-white-bright">
                  {c.modalTitle}
                </h2>
                <p className="mt-3 text-sm text-frsc-text-200">
                  <span className="font-semibold text-frsc-white-bright">
                    {claimSuccessItem.name}
                  </span>
                </p>
                <p className="mt-1 text-xs text-frsc-text-300/60">
                  {claimSuccessItem.price.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')} FRSC
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/dashboard#my-rewards"
                    onClick={() => setClaimSuccessItem(null)}
                    className="w-full rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_20px_rgba(224,48,78,0.3)] active:scale-[0.97]"
                  >
                    {c.modalButton}
                  </Link>
              <button
                type="button"
                onClick={() => setClaimSuccessItem(null)}
                className="cursor-pointer text-xs text-frsc-text-300/50 transition-colors hover:text-frsc-text-200"
              >
                {lang === 'id' ? 'Tutup' : 'Close'}
              </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
