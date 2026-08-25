'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  Rocket,
  Briefcase,
  Store,
  FileUser,
  Check,
  X,
  Clock,
  MessageCircle,
  Coins,
  LogIn,
  Loader2,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Input, TextArea } from '@/components/ui/Input'
import { TopupButton } from '@/components/TopupButton'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFRSC } from '@/contexts/FRSCContext'
import { LangContext, useLangState, useLang } from '@/hooks/useLang'

/**
 * Client-side mirror of the prices in app/api/web-builder/order/route.ts.
 * Keep both in sync. 1 FRSC = Rp 1.
 */
const PACKAGES = [
  { tier: 'startup', icon: Rocket, priceIdr: 100000, normalIdr: 500000, frsc: 100 },
  { tier: 'freelance', icon: Briefcase, priceIdr: 50000, normalIdr: 250000, frsc: 50 },
  { tier: 'lokal', icon: Store, priceIdr: 30000, normalIdr: 150000, frsc: 30 },
  { tier: 'portfolio', icon: FileUser, priceIdr: 20000, normalIdr: 100000, frsc: 20 },
] as const

type Tier = (typeof PACKAGES)[number]['tier']

const DISCOUNT_PERCENT = 80
const MAX_PAGES = 20

function formatIdr(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`
}

const pageContent = {
  id: {
    kicker: 'Jasa Pembuatan Website',
    h1: 'Website Jadi, Tanpa Pusing',
    sub: 'Nggak perlu ngerti kode atau AI. Ceritakan kebutuhanmu lewat form singkat, bayar pakai FRSC, dan tim kami yang kerjakan sampai online.',
    urgency: 'Harga pembukaan untuk 50 pesanan pertama — bisa naik sewaktu-waktu.',
    heroCta: 'Lihat Paket & Harga',
    saveLabel: 'Hemat 80%',
    perPage: '/halaman',
    popularLabel: 'Paling Laris',
    choose: 'Pilih Ini',
    selected: 'Dipilih',
    packages: [
      {
        tier: 'startup' as Tier,
        name: 'Web Startup',
        tagline: 'Calon founder yang butuh landing page produk meyakinkan di depan investor dan pengguna.',
      },
      {
        tier: 'freelance' as Tier,
        name: 'Web Freelance',
        tagline: 'Freelancer yang ingin memajang jasa dan portofolio dengan satu halaman yang rapi.',
      },
      {
        tier: 'lokal' as Tier,
        name: 'Web Bisnis Lokal',
        tagline: 'Warung, bengkel, klinik, salon — pelanggan baru sering mulai dari pencarian Google.',
      },
      {
        tier: 'portfolio' as Tier,
        name: 'Portfolio / CV Online',
        tagline: 'Pelamar kerja yang mau tampil beda dengan link portfolio di CV-nya.',
      },
    ],
    includeTitle: 'Semua Paket Sudah Termasuk',
    includeItems: [
      'Desain rapi & responsif di HP, tablet, dan laptop',
      'Copywriting dasar — teksmu dirapikan biar menjual',
      'SEO dasar supaya ditemukan di Google',
      'Tombol WhatsApp langsung terhubung ke kamu',
      'Diserahkan siap pakai lengkap dengan panduan singkat',
    ],
    excludeTitle: 'Yang Perlu Kamu Tahu',
    excludeItems: [
      'Termasuk 1x revisi per pesanan',
      'Fokus landing page — bukan aplikasi web',
      'Belum termasuk fitur rumit: login member, e-commerce, integrasi API',
      'Domain & hosting bulanan di luar harga (bisa kami bantu setup)',
    ],
    stepsTitle: 'Cara Kerjanya Semudah Ini',
    steps: [
      { title: 'Isi Form Singkat', desc: '2 menit saja. Nggak ada istilah teknis yang bikin bingung.' },
      { title: 'Bayar dengan FRSC', desc: 'Coin digital Farisium. Top-up lewat QRIS mulai Rp 10 ribu.' },
      { title: 'Kami yang Kerjakan', desc: '3–5 hari kerja setelah datamu lengkap.' },
      { title: 'Terima Preview', desc: 'Sekali revisi kalau ada yang kurang pas, lalu website siap dipakai.' },
    ],
    formTitle: 'Pesan Sekarang',
    formSub: 'Isi 5 kolom di bawah — sisanya biar kami yang urus.',
    nameLabel: 'Nama kamu',
    namePlaceholder: 'Contoh: Budi Santoso',
    contactLabel: 'Nomor WhatsApp',
    contactPlaceholder: 'Contoh: 0812xxxxxxx',
    packageLabel: 'Pilih paket',
    pagesLabel: 'Jumlah halaman',
    notesLabel: 'Ceritakan kebutuhanmu (opsional)',
    notesPlaceholder: 'Contoh: saya punya usaha laundry, mau website berisi layanan, harga, dan lokasi...',
    totalLabel: 'Total pesanan',
    balanceLabel: 'Saldo FRSC kamu',
    afterLabel: 'Saldo setelah bayar',
    payButton: 'Bayar & Kirim Pesanan',
    paying: 'Memproses...',
    loginTitle: 'Login dulu untuk memesan',
    loginDesc: 'Pesanan dan pembayaran FRSC butuh akun Farisium. Gratis, cukup satu klik dengan Google.',
    loginBtn: 'Masuk dengan Google',
    insufficient: 'Saldo FRSC belum cukup. Top up dulu — prosesnya cepat lewat QRIS.',
    fillAll: 'Mohon isi nama dan nomor WhatsApp dulu ya.',
    genericError: 'Ada kendala. Coba lagi atau hubungi kami.',
    successTitle: 'Pesanan Diterima!',
    successDesc: 'Terima kasih! Tim kami akan menghubungimu lewat WhatsApp dalam 1x24 jam. Simpan ID pesananmu:',
    successBack: 'Buat Pesanan Lain',
    faqTitle: 'Pertanyaan yang Sering Ditanyakan',
    faqs: [
      {
        q: 'Saya gaptek. Nanti websitenya gimana cara online-nya?',
        a: 'Tenang, kami urus sampai online. Kamu tinggal terima link website-nya dan langsung pakai. Panduan singkat juga disertakan kalau nanti mau update sendiri.',
      },
      {
        q: 'Kenapa harganya bisa semurah ini?',
        a: 'Kami memakai AI untuk mempercepat sebagian besar pekerjaan, lalu manusia yang merapikan kualitasnya. Waktu pengerjaan yang hemat membuat biayanya ikut turun — dan kami teruskan ke kamu.',
      },
      {
        q: 'Kalau hasilnya kurang sreg gimana?',
        a: 'Setiap pesanan sudah termasuk 1x revisi. Tips: kumpulkan semua masukan jadi satu daftar, lalu kami eksekusi sekali jalan supaya hasilnya maksimal.',
      },
      {
        q: 'Cara bayarnya bagaimana?',
        a: 'Pembayaran menggunakan FRSC, coin digital milik Farisium. 1 FRSC = Rp 1 jadi gampang dihitung. Belum punya FRSC? Top up lewat QRIS mulai Rp 10 ribu, atau klaim reward gratis tiap hari.',
      },
    ],
  },
  en: {
    kicker: 'Website Building Service',
    h1: 'Get a Website, Zero Hassle',
    sub: "No coding or AI knowledge needed. Tell us what you need in a short form, pay with FRSC, and our team builds it until it's live.",
    urgency: 'Launch pricing for the first 50 orders — may go up anytime.',
    heroCta: 'See Packages & Pricing',
    saveLabel: 'Save 80%',
    perPage: '/page',
    popularLabel: 'Most Popular',
    choose: 'Choose This',
    selected: 'Selected',
    packages: [
      {
        tier: 'startup' as Tier,
        name: 'Startup Website',
        tagline: 'Founders who need a convincing product landing page for investors and users.',
      },
      {
        tier: 'freelance' as Tier,
        name: 'Freelance Website',
        tagline: 'Freelancers who want to showcase their services and work on one clean page.',
      },
      {
        tier: 'lokal' as Tier,
        name: 'Local Business Website',
        tagline: 'Shops, workshops, clinics, salons — new customers often start from a Google search.',
      },
      {
        tier: 'portfolio' as Tier,
        name: 'Portfolio / Online CV',
        tagline: 'Job seekers who want to stand out with a portfolio link on their resume.',
      },
    ],
    includeTitle: 'Every Package Includes',
    includeItems: [
      'Clean, responsive design on phone, tablet, and laptop',
      'Basic copywriting — your text polished so it sells',
      'Basic SEO so you can be found on Google',
      'A WhatsApp button connected straight to you',
      'Delivered ready-to-use with a short guide',
    ],
    excludeTitle: 'Good to Know',
    excludeItems: [
      'Includes 1 revision per order',
      'Focused on landing pages — not web apps',
      'Complex features not included: member login, e-commerce, API integrations',
      'Domain & monthly hosting not included (we can help you set it up)',
    ],
    stepsTitle: 'How It Works — That Simple',
    steps: [
      { title: 'Fill a Short Form', desc: 'Just 2 minutes. No confusing technical terms.' },
      { title: 'Pay with FRSC', desc: "Farisium's digital coin. Top up via QRIS from IDR 10k." },
      { title: 'We Build It', desc: '3–5 working days once your details are complete.' },
      { title: 'Receive Your Preview', desc: 'One revision if anything feels off, then your site is ready.' },
    ],
    formTitle: 'Order Now',
    formSub: "Fill in the 5 fields below — we'll handle the rest.",
    nameLabel: 'Your name',
    namePlaceholder: 'e.g. John Doe',
    contactLabel: 'WhatsApp number',
    contactPlaceholder: 'e.g. +62 812xxxxxxx',
    packageLabel: 'Choose a package',
    pagesLabel: 'Number of pages',
    notesLabel: 'Tell us what you need (optional)',
    notesPlaceholder: "e.g. I run a laundry business, I want a page with services, pricing, and location...",
    totalLabel: 'Order total',
    balanceLabel: 'Your FRSC balance',
    afterLabel: 'Balance after payment',
    payButton: 'Pay & Send Order',
    paying: 'Processing...',
    loginTitle: 'Log in to place an order',
    loginDesc: 'Orders and FRSC payments require a Farisium account. Free — one click with Google.',
    loginBtn: 'Sign in with Google',
    insufficient: 'Not enough FRSC balance. Top up first — quick via QRIS.',
    fillAll: 'Please fill in your name and WhatsApp number first.',
    genericError: 'Something went wrong. Try again or contact us.',
    successTitle: 'Order Received!',
    successDesc: "Thank you! Our team will reach out via WhatsApp within 24 hours. Keep your order ID:",
    successBack: 'Place Another Order',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: "I'm not tech-savvy. How does my website go live?",
        a: "Don't worry — we handle everything until it's live. You just receive the link and start using it. A short guide is included in case you want to update it yourself later.",
      },
      {
        q: 'Why is it this affordable?',
        a: 'We use AI to speed up most of the work, then humans polish the quality. Faster turnaround means lower cost — and we pass that saving on to you.',
      },
      {
        q: "What if I don't like the result?",
        a: 'Every order includes 1 revision. Tip: gather all your feedback into one list and we execute it in one pass for the best result.',
      },
      {
        q: 'How do I pay?',
        a: 'Payments use FRSC, the Farisium digital coin. 1 FRSC = Rp 1, so it is easy to calculate. No FRSC yet? Top up via QRIS from IDR 10k, or claim free daily rewards.',
      },
    ],
  },
}

export default function WebsiteBuilderPage() {
  const langState = useLangState()

  return (
    <LangContext.Provider value={langState}>
      <WebsiteBuilderContent />
    </LangContext.Provider>
  )
}

function WebsiteBuilderContent() {
  const { lang } = useLang()
  const t = pageContent[lang] ?? pageContent.id

  const { user, loading, signIn } = useAuthContext()
  const { coins, refreshCoins } = useFRSC()

  const [selectedTier, setSelectedTier] = useState<Tier>('lokal')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [pages, setPages] = useState(1)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null)

  const formRef = useRef<HTMLDivElement>(null)

  const pkg = PACKAGES.find((p) => p.tier === selectedTier) ?? PACKAGES[0]
  const totalPages = Math.min(Math.max(Number(pages) || 1, 1), MAX_PAGES)
  const totalPriceIdr = pkg.priceIdr * totalPages
  const totalFrsc = pkg.frsc * totalPages
  const enoughCoins = coins >= totalFrsc

  function selectPackage(tier: Tier) {
    setSelectedTier(tier)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || submitting) return
    if (!name.trim() || !contact.trim()) {
      setError(t.fillAll)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/web-builder/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          userEmail: user.email,
          name,
          contact,
          packageTier: selectedTier,
          pages: totalPages,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.genericError)
      await refreshCoins()
      setSuccessOrderId(data.orderId)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Ambient background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-frsc-crimson-500/[0.05] blur-3xl" />
          <div className="absolute -right-40 top-1/2 h-80 w-80 rounded-full bg-frsc-purple-500/[0.05] blur-3xl" />
        </div>

        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 text-center lg:px-6">
          <span className="kicker mb-4">
            <span className="kicker-line" aria-hidden="true" />
            {t.kicker}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground mx-auto max-w-3xl text-balance">
            {t.h1}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lead leading-relaxed text-frsc-text-200">
            {t.sub}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="#packages"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97]"
            >
              {t.heroCta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="flex items-center gap-1.5 text-xs text-frsc-text-300">
              <Sparkles className="h-3.5 w-3.5 text-frsc-crimson-400" />
              {t.urgency}
            </p>
          </div>
        </section>

        {/* Packages */}
        <section id="packages" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-16 lg:px-6">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PACKAGES.map((p, i) => {
              const info = t.packages[i]
              const Icon = p.icon
              const isSelected = selectedTier === p.tier
              return (
                <GlassCard
                  key={p.tier}
                  variant={isSelected ? 'default' : 'subtle'}
                  blur="light"
                  withReflection={true}
                  withAccent={isSelected ? 'crimson' : 'none'}
                  className={`relative flex h-full flex-col p-6 transition-all duration-300 ${isSelected ? 'border-frsc-crimson-500/40 shadow-metallic-lg' : 'hover:border-frsc-crimson-500/25'}`}
                >
                  {i === 3 && (
                    <div className="absolute right-4 top-4 z-[3]">
                      <Badge variant="crimson" size="sm">{t.popularLabel}</Badge>
                    </div>
                  )}
                  <div className="relative z-[2] flex h-full flex-col">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/30">
                      <Icon className="h-5 w-5 text-frsc-crimson-400" />
                    </div>

                    <h2 className="mt-4 font-heading text-lg font-semibold text-frsc-white-bright">
                      {info.name}
                    </h2>
                    <p className="mt-1.5 min-h-12 text-sm leading-relaxed text-frsc-text-300">
                      {info.tagline}
                    </p>

                    <div className="mt-4">
                      <span className="text-xs text-frsc-text-300 line-through">
                        {formatIdr(p.normalIdr)}
                      </span>
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                        <span className="font-heading text-2xl font-bold text-frsc-white-bright">
                          {formatIdr(p.priceIdr)}
                        </span>
                        <span className="text-xs text-frsc-text-300">{t.perPage}</span>
                        <Badge variant="crimson" size="sm">-{DISCOUNT_PERCENT}%</Badge>
                      </div>
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-frsc-crimson-400">
                        <Coins className="h-3.5 w-3.5" />
                        {p.frsc} FRSC{t.perPage} · {t.saveLabel}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectPackage(p.tier)}
                      className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-[0.97] ${
                        isSelected
                          ? 'bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] text-white hover:bg-[length:100%_100%]'
                          : 'border border-border text-frsc-text-100 hover:border-frsc-crimson-500/40 hover:text-frsc-crimson-300'
                      }`}
                    >
                      {isSelected ? t.selected : t.choose}
                    </button>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </section>

        {/* Include / Exclude */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 lg:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            <GlassCard variant="default" blur="light" withReflection={false} className="p-6 sm:p-8">
              <h2 className="font-heading text-base font-semibold text-frsc-white-bright">
                {t.includeTitle}
              </h2>
              <ul className="mt-4 space-y-3">
                {t.includeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-frsc-text-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard variant="subtle" blur="light" withReflection={false} className="p-6 sm:p-8">
              <h2 className="font-heading text-base font-semibold text-frsc-white-bright">
                {t.excludeTitle}
              </h2>
              <ul className="mt-4 space-y-3">
                {t.excludeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-frsc-text-200">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-frsc-crimson-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* Steps */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h2 text-center text-frsc-text-100">{t.stepsTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((step, i) => (
              <GlassCard key={step.title} variant="subtle" blur="light" withReflection={false} className="p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 font-heading text-sm font-bold text-frsc-crimson-300 ring-1 ring-frsc-crimson-500/30">
                  {i + 1}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-frsc-white-bright">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-frsc-text-300">{step.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Order form */}
        <section ref={formRef} className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 pb-16 lg:px-6">
          <GlassCard variant="default" blur="light" withReflection={true} withAccent="crimson" className="p-6 sm:p-8">
            <div className="relative z-[2]">
              {successOrderId ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                    <Check className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h2 className="mt-4 font-heading text-xl font-bold text-frsc-white-bright">
                    {t.successTitle}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-frsc-text-200">
                    {t.successDesc}
                  </p>
                  <p className="mt-3 inline-block rounded-lg border border-border bg-frsc-black/60 px-4 py-2 font-mono text-sm text-frsc-crimson-300">
                    {successOrderId}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => { setSuccessOrderId(null); setName(''); setContact(''); setNotes(''); setPages(1) }}
                      className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-frsc-text-100 transition-colors hover:border-frsc-crimson-500/40 hover:text-frsc-crimson-300"
                    >
                      {t.successBack}
                    </button>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-frsc-crimson-400" />
                </div>
              ) : !user ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-frsc-crimson-800/20 ring-1 ring-frsc-crimson-500/30">
                    <LogIn className="h-6 w-6 text-frsc-crimson-400" />
                  </div>
                  <h2 className="mt-4 font-heading text-xl font-bold text-frsc-white-bright">
                    {t.loginTitle}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-frsc-text-200">
                    {t.loginDesc}
                  </p>
                  <button
                    type="button"
                    onClick={signIn}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97]"
                  >
                    <LogIn className="h-4 w-4" />
                    {t.loginBtn}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-xl font-bold text-frsc-white-bright">{t.formTitle}</h2>
                  <p className="mt-1 text-sm text-frsc-text-300">{t.formSub}</p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="wb-name" className="mb-1.5 block text-xs font-medium text-frsc-text-200">
                          {t.nameLabel}
                        </label>
                        <Input
                          id="wb-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.namePlaceholder}
                          maxLength={100}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="wb-contact" className="mb-1.5 block text-xs font-medium text-frsc-text-200">
                          {t.contactLabel}
                        </label>
                        <Input
                          id="wb-contact"
                          type="tel"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder={t.contactPlaceholder}
                          maxLength={30}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="wb-package" className="mb-1.5 block text-xs font-medium text-frsc-text-200">
                          {t.packageLabel}
                        </label>
                        <select
                          id="wb-package"
                          value={selectedTier}
                          onChange={(e) => setSelectedTier(e.target.value as Tier)}
                          className="h-10 w-full rounded-lg border border-border bg-frsc-surface-800/60 px-3 text-sm text-frsc-text-100 outline-none transition-all focus-visible:border-frsc-crimson-500/40 focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/30"
                        >
                          {PACKAGES.map((p, i) => (
                            <option key={p.tier} value={p.tier}>
                              {t.packages[i].name} — {formatIdr(p.priceIdr)}{t.perPage}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="wb-pages" className="mb-1.5 block text-xs font-medium text-frsc-text-200">
                          {t.pagesLabel} (1–{MAX_PAGES})
                        </label>
                        <Input
                          id="wb-pages"
                          type="number"
                          min={1}
                          max={MAX_PAGES}
                          step={1}
                          value={pages}
                          onChange={(e) => setPages(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="wb-notes" className="mb-1.5 block text-xs font-medium text-frsc-text-200">
                        {t.notesLabel}
                      </label>
                      <TextArea
                        id="wb-notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t.notesPlaceholder}
                        maxLength={2000}
                      />
                    </div>

                    {/* Summary */}
                    <div className="space-y-2 rounded-xl border border-border bg-frsc-black/50 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-frsc-text-300">{t.totalLabel}</span>
                        <span className="font-heading text-lg font-bold text-frsc-white-bright">
                          {formatIdr(totalPriceIdr)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-frsc-text-300">
                          <Coins className="h-3.5 w-3.5 text-frsc-crimson-400" />
                          {t.balanceLabel}: {coins} FRSC
                        </span>
                        <span className={enoughCoins ? 'text-frsc-text-300' : 'font-semibold text-frsc-crimson-400'}>
                          {t.afterLabel}: {Math.max(0, coins - totalFrsc)} FRSC
                        </span>
                      </div>
                    </div>

                    {!enoughCoins && (
                      <div className="flex flex-col items-start gap-3 rounded-xl border border-frsc-crimson-500/30 bg-frsc-crimson-900/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-relaxed text-frsc-text-200">{t.insufficient}</p>
                        <TopupButton className="shrink-0 !px-4 !py-2 !text-xs" />
                      </div>
                    )}

                    {error && (
                      <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-xs text-red-300">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.paying}
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4" />
                          {t.payButton} · {totalFrsc} FRSC
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </GlassCard>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-4 pb-24 lg:px-6">
          <h2 className="heading-fluid text-h2 text-center text-frsc-text-100">{t.faqTitle}</h2>
          <div className="mt-8 space-y-3">
            {t.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border bg-frsc-surface-800/40 transition-colors open:border-frsc-crimson-500/25"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-frsc-text-100 [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-frsc-text-300 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="border-t border-border/60 px-4 py-3 text-sm leading-relaxed text-frsc-text-200">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-frsc-text-300">
            <Clock className="h-3.5 w-3.5" />
            {lang === 'id'
              ? 'Pengerjaan dimulai setelah data lengkap kami terima.'
              : 'Work starts once we receive your complete details.'}
          </p>
        </section>
      </main>

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
