'use client'

import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useLang } from '@/hooks/useLang'
import { FStreamSpotifyPromotionHowItWorks } from '@/components/f-stream-spotify-promotion/FStreamSpotifyPromotionHowItWorks'
import { FStreamSpotifyPromotionResults } from '@/components/f-stream-spotify-promotion/FStreamSpotifyPromotionResults'
import { FStreamSpotifyPromotionForm } from '@/components/f-stream-spotify-promotion/FStreamSpotifyPromotionForm'
import {
  Music,
  Disc3,
  Radio,
  BarChart3,
  TrendingUp,
  Globe,
  Sparkles,
  Target,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  ListMusic,
  ChevronRight,
  Star,
  Zap,
} from 'lucide-react'

const content = {
  id: {
    badge: 'Spotify Promotion by Farisium',
    heroDesc:
      'F-Stream Boost Spotify Promotion adalah kampanye promosi Spotify yang sepenuhnya dijalankan oleh AI agent Farisium. Submit link lagumu, lalu AI agent menganalisis karakter lagu, menyusun pitch, mengirim lagu ke kurator playlist, menjalankan iklan tertarget, dan memantau performa kampanye secara otomatis.',
    ctaPrimary: 'Mulai Kampanye',
    ctaSecondary: 'Lihat Hasil',
    trust1: 'Kampanye dijalankan AI agent',
    trust2: 'Pitch playlist & iklan otomatis',
    trust3: 'Jendela kampanye 7–10 hari',
    sidebarPackage: 'Paket Kampanye',
    sidebarNote: 'Harga spesial: {frsc} = {idr} saat payment.',
    sidebarSafe: 'Pertumbuhan aman & organik',
    pricingTitle: 'Mulai Kembangkan Musikmu Hari Ini',
    pricingDesc: 'Harga spesial peluncuran tersedia untuk waktu terbatas.',
    pricingSpecial: 'Harga Spesial',
    pricingNote: 'Harga spesial: {frsc} = {idr} saat payment.',
    pricingCta: 'Mulai Kampanye Spotify',
    featuresEyebrow: 'Fitur',
    featuresTitle: 'Semua yang Kamu Butuhkan untuk Berkembang',
    featuresDesc:
      'Kampanye yang dikelola penuh AI agent — dari pitch playlist hingga iklan tertarget.',
    features: [
      {
        icon: Globe,
        title: 'Kampanye dijalankan AI agent',
        desc: 'AI agent mengelola seluruh kampanye secara otomatis di berbagai negara untuk menjangkau pendengar asli yang relevan.',
      },
      {
        icon: Radio,
        title: 'Pitch lagu ke kurator playlist',
        desc: 'AI agent menyusun pitch presentasi dan mengirim lagumu ke kurator independen untuk direview dan dipertimbangkan masuk playlist mereka.',
      },
      {
        icon: Disc3,
        title: 'Push otomatis ke playlist pitch',
        desc: 'Lagu di-push ke pitch playlist secara otomatis berdasarkan kecocokan genre, tempo, dan karakter audiens.',
      },
      {
        icon: BarChart3,
        title: 'Iklan tertarget otomatis',
        desc: 'AI agent menjalankan iklan tertarget ke demografi pendengar paling relevan untuk mempercepat pertumbuhan.',
      },
      {
        icon: Sparkles,
        title: 'Analisis & penargetan audiens AI',
        desc: 'AI menganalisis karakteristik lagumu untuk menemukan pendengar yang paling sesuai dengan musikmu.',
      },
      {
        icon: TrendingUp,
        title: 'Pelacakan & laporan performa oleh AI',
        desc: 'AI memantau metrik kampanye real-time dan menyusun laporan performa otomatis.',
      },
    ],
    targetsEyebrow: 'Target Kampanye',
    targetsTitle: 'Pilih Paket yang Sesuai',
    targetsDesc: 'Dua pilihan paket untuk membantu musikmu mencapai lebih banyak pendengar.',
    paket1: {
      name: 'Paket 1',
      streams: '+1,000',
      listeners: '300+',
      desc: 'Stream target',
      listenerLabel: 'Pendengar baru',
      duration: '7–10 hari',
    },
    paket2: {
      name: 'Paket 2',
      streams: '+3,000',
      listeners: '600+',
      desc: 'Stream target',
      listenerLabel: 'Pendengar baru',
      duration: '7–10 hari',
    },
    formEyebrow: 'Mulai',
    formTitle: 'Mulai Kampanye Spotify-mu',
    formDesc: 'Submit lagumu dan biarkan Farisium membantumu menjangkau lebih banyak pendengar.',
    faqTitle: 'Pertanyaan Umum',
    faqs: [
      {
        q: 'Bagaimana cara kerja F-Stream Boost?',
        a: 'AI agent Farisium menganalisis lagumu, menyusun pitch, mengirim pitch ke kurator playlist, menjalankan kampanye iklan tertarget, lalu memantau hasilnya selama 7–10 hari.',
      },
      {
        q: 'Apakah ini aman untuk akun Spotify saya?',
        a: 'Ya. Seluruh proses dikelola AI agent tanpa bot, streaming palsu, atau metode buatan. Pertumbuhan berasal dari pitch playlist asli dan kampanye pendengar nyata.',
      },
      {
        q: 'Berapa lama kampanye berlangsung?',
        a: 'Kampanye biasanya berjalan selama 7–10 hari. Hasil dapat bervariasi tergantung genre, kualitas lagu, kecocokan audiens, dan respons kurator.',
      },
      {
        q: 'Bisakah saya melacak progres kampanye?',
        a: 'Ya. AI agent memantau kampanye secara real-time dan progres dapat dilacak melalui dashboard Farisium setelah pesananmu diproses.',
      },
    ],
    disclaimer:
      'F-Stream Boost dikelola otomatis oleh AI agent Farisium. Farisium tidak menggunakan bot, streaming palsu, atau metode streaming buatan. Hasil dapat bervariasi tergantung genre, kualitas lagu, kecocokan audiens, respons kurator, dan performa kampanye.',
  },
  en: {
    badge: 'Spotify Promotion by Farisium',
    heroDesc:
      'F-Stream Boost Spotify Promotion is a Spotify promotion campaign fully handled by Farisium\'s AI agent. Submit your track link, and the AI agent analyzes the track, builds the pitch, pushes it to playlist curators, runs targeted ads, and automatically tracks campaign performance.',
    ctaPrimary: 'Start Campaign',
    ctaSecondary: 'View Results',
    trust1: 'AI agent-run campaign',
    trust2: 'Playlist pitching & automated ads',
    trust3: '7–10 days campaign window',
    sidebarPackage: 'Campaign Package',
    sidebarNote: 'Special price: {frsc} = {idr} at payment.',
    sidebarSafe: 'Safe & organic growth',
    pricingTitle: 'Start Growing Your Music Today',
    pricingDesc: 'Special launch pricing available for a limited time.',
    pricingSpecial: 'Special Price',
    pricingNote: 'Special price: {frsc} = {idr} at payment.',
    pricingCta: 'Start Spotify Campaign',
    featuresEyebrow: 'Features',
    featuresTitle: 'Everything You Need to Grow',
    featuresDesc:
      'A campaign fully managed by an AI agent — from playlist pitching to targeted ads.',
    features: [
      {
        icon: Globe,
        title: 'AI agent-run campaign',
        desc: 'The AI agent manages the entire campaign automatically across multiple countries to reach relevant real listeners.',
      },
      {
        icon: Radio,
        title: 'Playlist curator pitching',
        desc: 'The AI agent builds the presentation pitch and sends your track to independent curators who review and consider it for their playlists.',
      },
      {
        icon: Disc3,
        title: 'Automatic playlist pitch push',
        desc: 'Your track is pushed to playlist pitches automatically based on genre matching, tempo, and audience characteristics.',
      },
      {
        icon: BarChart3,
        title: 'Automated targeted ads',
        desc: 'The AI agent runs targeted ads toward the most relevant listener demographics to accelerate growth.',
      },
      {
        icon: Sparkles,
        title: 'AI audience analysis & targeting',
        desc: 'AI analyzes your track characteristics to find the listeners who fit your music best.',
      },
      {
        icon: TrendingUp,
        title: 'AI performance tracking & reports',
        desc: 'AI monitors real-time campaign metrics and produces automatic performance reports.',
      },
    ],
    targetsEyebrow: 'Campaign Targets',
    targetsTitle: 'Choose Your Package',
    targetsDesc: 'Two package options to help your music reach more listeners.',
    paket1: {
      name: 'Paket 1',
      streams: '+1,000',
      listeners: '300+',
      desc: 'Stream target',
      listenerLabel: 'New listeners',
      duration: '7–10 days',
    },
    paket2: {
      name: 'Paket 2',
      streams: '+3,000',
      listeners: '600+',
      desc: 'Stream target',
      listenerLabel: 'New listeners',
      duration: '7–10 days',
    },
    formEyebrow: 'Get Started',
    formTitle: 'Start Your Spotify Campaign',
    formDesc: 'Submit your track and let Farisium help you reach more listeners.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'How does F-Stream Boost work?',
        a: 'Farisium\'s AI agent analyzes your track, builds the pitch, sends it to playlist curators, runs a targeted ad campaign, then monitors the results over 7–10 days.',
      },
      {
        q: 'Is this safe for my Spotify account?',
        a: 'Yes. The entire process is handled by the AI agent without bots, fake streams, or artificial methods. Growth comes from real playlist pitching and real listener campaigns.',
      },
      {
        q: 'How long does a campaign take?',
        a: 'Campaigns typically run for 7–10 days. Results may vary depending on genre, song quality, audience fit, and curator response.',
      },
      {
        q: 'Can I track my campaign progress?',
        a: 'Yes. The AI agent monitors the campaign in real time, and progress can be tracked through your Farisium dashboard once your order is being processed.',
      },
    ],
    disclaimer:
      'F-Stream Boost is automatically managed by Farisium\'s AI agent. Farisium does not use bots, fake streams, or artificial streaming methods. Results may vary depending on genre, song quality, audience fit, curator response, and campaign performance.',
  },
}

const pricingData = [
  {
    tier: 'paket-1' as const,
    badge: { id: 'Harga Spesial', en: 'Special Price' },
    normalPriceIdr: 'Rp1.000.000',
    normalPriceFrsc: '2,000 FRSC',
    priceIdr: 'Rp299.000',
    priceFrsc: '600 FRSC',
    items: {
      id: [
        '+1.000 target stream Spotify',
        '300+ target pendengar baru bulanan',
        'Jendela kampanye 7–10 hari',
        'Dikelola penuh AI agent',
        'Pitch lagu otomatis ke kurator playlist',
        'Iklan tertarget & pelacakan performa oleh AI',
      ],
      en: [
        '+1,000 Spotify stream target',
        '300+ new monthly listener target',
        '7–10 days campaign window',
        'Fully managed by AI agent',
        'Automatic pitching to playlist curators',
        'Targeted ads & AI performance tracking',
      ],
    },
  },
  {
    tier: 'paket-2' as const,
    badge: { id: 'Harga Spesial', en: 'Special Price' },
    normalPriceIdr: 'Rp1.500.000',
    normalPriceFrsc: '3,000 FRSC',
    priceIdr: 'Rp399.000',
    priceFrsc: '800 FRSC',
    items: {
      id: [
        '+3.000 target stream Spotify',
        '600+ target pendengar baru bulanan',
        'Jendela kampanye 7–10 hari',
        'Dikelola penuh AI agent',
        'Pitch lagu otomatis ke kurator playlist',
        'Iklan tertarget & pelacakan performa oleh AI',
      ],
      en: [
        '+3,000 Spotify stream target',
        '600+ new monthly listener target',
        '7–10 days campaign window',
        'Fully managed by AI agent',
        'Automatic pitching to playlist curators',
        'Targeted ads & AI performance tracking',
      ],
    },
  },
]

export default function FStreamSpotifyPromotionPage() {
  const { lang } = useLang()
  const c = content[lang] ?? content.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ══════════════════════════════════════════
            HERO SECTION
            ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-frsc-crimson-500/[0.04] blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-frsc-purple-500/[0.04] blur-3xl" />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 pt-20 pb-12 lg:px-6 lg:pt-28">
            <div className="mb-4">
              <Badge variant="premium" size="md">
                <Music className="mr-1.5 h-3 w-3 text-frsc-crimson-400" />
                {c.badge}
              </Badge>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
              <div>
                <h1 className="heading-fluid text-hero text-frsc-white-bright">
                  F-Stream Boost{' '}
                  <span className="animated-gradient-text">
                    Spotify Promotion
                  </span>
                </h1>
                <p className="mt-4 max-w-xl text-pretty text-lead text-frsc-text-200">
                  {c.heroDesc}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href="#order-form">
                    <Button
                      variant="crimson-gradient"
                      size="lg"
                      className="min-w-[160px]"
                    >
                      {c.ctaPrimary}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#results">
                    <Button variant="premium" size="lg">
                      {c.ctaSecondary}
                    </Button>
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-frsc-text-300/60">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3 w-3 text-frsc-crimson-400/60" />
                    {c.trust1}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="h-3 w-3 text-frsc-crimson-400/60" />
                    {c.trust2}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-frsc-crimson-400/60" />
                    {c.trust3}
                  </span>
                </div>
              </div>

              {/* Sidebar pricing */}
              <div className="hidden lg:block">
                <GlassCard
                  variant="premium"
                  blur="medium"
                  withReflection
                  withAccent="crimson"
                  className="p-6"
                >
                  <div className="relative z-[2] space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/20">
                        <ListMusic className="h-4 w-4 text-frsc-crimson-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-frsc-text-200">
                          {c.sidebarPackage}
                        </p>
                        <p className="text-[10px] text-frsc-text-300/60">
                          F-Stream Boost
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {pricingData.map((pkg, i) => (
                        <div
                          key={pkg.tier}
                          className={`rounded-xl border p-3 ${
                            i === 0
                              ? 'border-frsc-crimson-500/20 bg-frsc-crimson-900/10'
                              : 'border-frsc-purple-500/20 bg-frsc-purple-900/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-frsc-white-bright">
                              {pkg.tier === 'paket-1' ? c.paket1.name : c.paket2.name}
                            </span>
                            <Badge
                              variant={i === 0 ? 'crimson' : 'premium'}
                              size="sm"
                            >
                              {pkg.badge[lang] ?? pkg.badge.id}
                            </Badge>
                          </div>
                          <p className="mt-1 text-[10px] text-frsc-text-300/60 line-through">
                            {pkg.normalPriceIdr} / {pkg.normalPriceFrsc}
                          </p>
                          <p className="font-heading text-xl font-bold text-frsc-white-bright">
                            {pkg.priceIdr}
                          </p>
                          <p className="text-xs font-medium text-frsc-crimson-400">
                            / {pkg.priceFrsc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-frsc-text-300/50">
                      {c.sidebarNote
                        .replace('{frsc}', '600 FRSC / 800 FRSC')
                        .replace('{idr}', 'Rp299.000 / Rp399.000')}
                    </p>

                    <a href="#order-form">
                      <Button
                        variant="crimson-gradient"
                        size="lg"
                        className="w-full"
                      >
                        {c.pricingCta}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </a>

                    <div className="flex items-center gap-1.5 text-center text-[10px] text-frsc-text-300/40">
                      <ShieldCheck className="h-3 w-3 text-green-400/50" />
                      {c.sidebarSafe}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPAIGN TARGETS — TWO TIERS
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 lg:px-6">
          <div className="mb-8 text-center">
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">
              {c.targetsEyebrow}
            </span>
            <h2 className="heading-fluid text-h1 text-frsc-white-bright mt-3">
              {c.targetsTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-pretty text-sm text-frsc-text-200">
              {c.targetsDesc}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* PAKET 1 */}
            <div className="reveal-on-scroll reveal-stagger reveal-delay-1 rounded-2xl border border-frsc-crimson-500/20 bg-gradient-to-b from-frsc-crimson-900/10 to-frsc-surface-800 p-6 shadow-metallic">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/20">
                    <Star className="h-4 w-4 text-frsc-crimson-400" />
                  </div>
                  <h3 className="text-sm font-bold text-frsc-white-bright">
                    {c.paket1.name}
                  </h3>
                </div>
                <Badge variant="crimson" size="sm">
                  {c.pricingSpecial}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-frsc-crimson-500/10 bg-frsc-crimson-900/20 p-3 text-center">
                  <Target className="mx-auto mb-1 h-4 w-4 text-frsc-crimson-400" />
                  <p className="font-heading text-xl font-bold text-frsc-white-bright">
                    {c.paket1.streams}
                  </p>
                  <p className="text-[10px] text-frsc-text-300/60">{c.paket1.desc}</p>
                </div>
                <div className="rounded-xl border border-frsc-crimson-500/10 bg-frsc-crimson-900/20 p-3 text-center">
                  <Users className="mx-auto mb-1 h-4 w-4 text-frsc-crimson-400" />
                  <p className="font-heading text-xl font-bold text-frsc-white-bright">
                    {c.paket1.listeners}
                  </p>
                  <p className="text-[10px] text-frsc-text-300/60">
                    {c.paket1.listenerLabel}
                  </p>
                </div>
                <div className="rounded-xl border border-frsc-crimson-500/10 bg-frsc-crimson-900/20 p-3 text-center">
                  <Clock className="mx-auto mb-1 h-4 w-4 text-frsc-crimson-400" />
                  <p className="font-heading text-lg font-bold text-frsc-white-bright">
                    {c.paket1.duration}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-frsc-text-300/50">
                <span className="text-frsc-text-300/70 line-through">
                  {pricingData[0].normalPriceIdr} / {pricingData[0].normalPriceFrsc}
                </span>
                <span className="ml-2 font-semibold text-frsc-crimson-400">
                  {pricingData[0].priceIdr} / {pricingData[0].priceFrsc}
                </span>
              </p>
            </div>

            {/* PAKET 2 */}
            <div className="reveal-on-scroll reveal-stagger reveal-delay-2 rounded-2xl border border-frsc-purple-500/20 bg-gradient-to-b from-frsc-purple-900/10 to-frsc-surface-800 p-6 shadow-metallic">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/20">
                    <Zap className="h-4 w-4 text-frsc-purple-400" />
                  </div>
                  <h3 className="text-sm font-bold text-frsc-white-bright">
                    {c.paket2.name}
                  </h3>
                </div>
                <Badge variant="premium" size="sm">
                  {c.pricingSpecial}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-frsc-purple-500/10 bg-frsc-purple-900/20 p-3 text-center">
                  <Target className="mx-auto mb-1 h-4 w-4 text-frsc-purple-400" />
                  <p className="font-heading text-xl font-bold text-frsc-white-bright">
                    {c.paket2.streams}
                  </p>
                  <p className="text-[10px] text-frsc-text-300/60">{c.paket2.desc}</p>
                </div>
                <div className="rounded-xl border border-frsc-purple-500/10 bg-frsc-purple-900/20 p-3 text-center">
                  <Users className="mx-auto mb-1 h-4 w-4 text-frsc-purple-400" />
                  <p className="font-heading text-xl font-bold text-frsc-white-bright">
                    {c.paket2.listeners}
                  </p>
                  <p className="text-[10px] text-frsc-text-300/60">
                    {c.paket2.listenerLabel}
                  </p>
                </div>
                <div className="rounded-xl border border-frsc-purple-500/10 bg-frsc-purple-900/20 p-3 text-center">
                  <Clock className="mx-auto mb-1 h-4 w-4 text-frsc-purple-400" />
                  <p className="font-heading text-lg font-bold text-frsc-white-bright">
                    {c.paket2.duration}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-frsc-text-300/50">
                <span className="text-frsc-text-300/70 line-through">
                  {pricingData[1].normalPriceIdr} / {pricingData[1].normalPriceFrsc}
                </span>
                <span className="ml-2 font-semibold text-frsc-purple-400">
                  {pricingData[1].priceIdr} / {pricingData[1].priceFrsc}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PRICING SECTION — TWO PACKAGES
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-6">
          <div className="mb-10 text-center">
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">
              Pricing
            </span>
            <h2 className="heading-fluid text-h1 text-frsc-white-bright mt-3">
              {c.pricingTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
              {c.pricingDesc}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {pricingData.map((pkg, i) => (
              <GlassCard
                key={pkg.tier}
                variant="premium"
                blur="medium"
                withReflection
                withAccent={i === 0 ? 'crimson' : 'purple'}
                className="p-6 text-center"
              >
                <div className="relative z-[2]">
                  <Badge
                    variant={i === 0 ? 'crimson' : 'premium'}
                    size="md"
                    className="mb-4"
                  >
                    {pkg.badge[lang] ?? pkg.badge.id}
                  </Badge>

                  <p className="text-sm text-frsc-text-300/60 line-through">
                    {pkg.normalPriceIdr} / {pkg.normalPriceFrsc}
                  </p>

                  <p className="mt-2 font-heading text-4xl font-bold text-frsc-white-bright">
                    {pkg.priceIdr}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-frsc-crimson-400">
                    / {pkg.priceFrsc}
                  </p>

                  <p className="mx-auto mt-3 max-w-xs text-xs text-frsc-text-300/50">
                    {c.pricingNote
                      .replace('{frsc}', pkg.priceFrsc)
                      .replace('{idr}', pkg.priceIdr)}
                  </p>

                  <div className="mt-6 space-y-2 text-left">
                    {(pkg.items[lang] ?? pkg.items.id).map((item: string) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-frsc-text-200"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-frsc-crimson-800/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-frsc-crimson-400" />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>

                  <a href="#order-form" className="mt-6 block">
                    <Button
                      variant="crimson-gradient"
                      size="lg"
                      className="w-full"
                    >
                      {c.pricingCta}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURE GRID
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-6">
          <div className="mb-10 text-center">
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">
              {c.featuresEyebrow}
            </span>
            <h2 className="heading-fluid text-h1 text-frsc-white-bright mt-3">
              {c.featuresTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
              {c.featuresDesc}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.features.map((feature, i) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`reveal-on-scroll reveal-stagger ${['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5', 'reveal-delay-6'][i]} hover-lift rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/20 mb-4">
                    <IconComponent className="h-5 w-5 text-frsc-crimson-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-frsc-white-bright">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-frsc-text-200">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS
            ══════════════════════════════════════════ */}
        <FStreamSpotifyPromotionHowItWorks />

        {/* Ad slot */}
        <div className="flex justify-center px-4">
          <div
            className="flex w-full max-w-xl items-center justify-center overflow-hidden rounded-xl border border-dashed border-frsc-surface-600/40 bg-frsc-surface-800/20"
            style={{ minHeight: 90 }}
          >
            <span className="text-[10px] text-frsc-text-300/30">AdSpace</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RESULTS PREVIEW
            ══════════════════════════════════════════ */}
        <div id="results">
          <FStreamSpotifyPromotionResults />
        </div>

        {/* ══════════════════════════════════════════
            ORDER FORM
            ══════════════════════════════════════════ */}
        <section
          id="order-form"
          className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-6"
        >
          <div className="mb-10 text-center">
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">
              {c.formEyebrow}
            </span>
            <h2 className="heading-fluid text-h1 text-frsc-white-bright mt-3">
              {c.formTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
              {c.formDesc}
            </p>
          </div>

          <div className="mx-auto max-w-lg">
            <FStreamSpotifyPromotionForm />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ / DISCLAIMER
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-6">
          <div className="mb-8 text-center">
            <h2 className="heading-fluid text-h2 text-frsc-white-bright">
              {c.faqTitle}
            </h2>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {c.faqs.map(({ q, a }) => (
              <div
                key={q}
                className="reveal-on-scroll reveal-stagger rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic"
              >
                <h3 className="mb-2 text-sm font-semibold text-frsc-white-bright">
                  {q}
                </h3>
                <p className="text-sm leading-relaxed text-frsc-text-200">
                  {a}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-white/[0.04] bg-white/[0.015] p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-frsc-text-300/50">
              <ShieldCheck className="h-3.5 w-3.5 text-green-400/50" />
              <p>{c.disclaimer}</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
