import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { TopupButton } from '@/components/TopupButton'
import { Coins, Wand2, Shield, ArrowRight, Globe, Headphones, FileText } from 'lucide-react'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'
import { WebBuilderCheckout } from '@/components/WebBuilderCheckout'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ order?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  if (params.order) {
    const titles = {
      id: `Bayar Pesanan — Farisium`,
      en: `Pay Order — Farisium`,
    }
    const descriptions = {
      id: 'Selesaikan pembayaran pesanan Website Builder kamu.',
      en: 'Complete payment for your Website Builder order.',
    }
    return {
      title: titles[lang],
      description: descriptions[lang],
      robots: { index: false, follow: false },
    }
  }

  const titles = { id: 'FRSC — Farisium', en: 'FRSC — Farisium' }
  const descriptions = {
    id: 'Pelajari tentang FRSC, utility point resmi ekosistem Farisium. Cara mendapatkan, cara menggunakan, dan FAQ lengkap.',
    en: 'Learn about FRSC, the official utility point of the Farisium ecosystem. How to earn, how to use, and complete FAQ.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/frsc')
  const alternates = getHreflangLinks('/frsc', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FRSC Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

const pageContent = {
  id: {
    badge: 'FRSC',
    heading: 'FRSC — Farisium Coin',
    description: 'FRSC adalah utility point resmi ekosistem Farisium. Digunakan untuk mengakses layanan AI, mengklaim reward, dan berpartisipasi dalam berbagai program. FRSC bukan mata uang dan bukan instrumen investasi.',
    usageTitle: 'Kegunaan FRSC',
    usages: [
      { icon: Wand2, title: 'Anime Generator', desc: '1 FRSC per gambar' },
      { icon: Globe, title: 'Website Builder', desc: '30–100 FRSC per halaman' },
      { icon: Headphones, title: 'F-Stream Spotify', desc: 'Paket mulai 500 FRSC' },
      { icon: FileText, title: 'SEO Caption Generator', desc: 'Gratis' },
    ],
    waysTitle: 'Cara Mendapatkan FRSC',
    ways: [
      { title: 'Starter Coin', desc: 'FRSC gratis saat pertama kali mendaftar.' },
      { title: 'Daily Reward', desc: '+1 FRSC gratis setiap 24 jam.' },
      { title: 'Referral', desc: 'Bonus FRSC untuk setiap pengguna baru yang kamu ajak.' },
      { title: 'Loyalty Reward', desc: 'Bonus berdasarkan umur akun dan aktivitas.' },
      { title: 'Event Resmi', desc: 'Event Farisium memberikan FRSC ekstra secara berkala.' },
      { title: 'Paket FRSC', desc: 'Beli paket FRSC untuk mendukung pengembangan platform.' },
    ],
    cta: 'Klaim Reward Sekarang',
    disclaimerTitle: 'Penting Dibaca',
    disclaimerText: 'FRSC adalah utility point yang hanya berlaku di dalam ekosistem Farisium. FRSC tidak memiliki nilai moneter, tidak bisa dijual, diperdagangkan, atau ditukar ke bentuk mata uang apapun. Penggunaan FRSC tunduk pada Ketentuan Penggunaan Farisium.',
    faqTitle: 'FAQ',
    faqs: [
      { q: 'Apakah FRSC bisa dijual atau ditukar ke uang?', a: 'Tidak. FRSC adalah utility point yang hanya bisa digunakan di dalam ekosistem Farisium. FRSC tidak memiliki nilai moneter dan tidak bisa diperdagangkan.' },
      { q: 'Apakah FRSC bisa hangus?', a: 'FRSC yang diperoleh dari Reward tidak hangus selama akun aktif. Ketentuan mungkin berbeda untuk paket tertentu.' },
      { q: 'Berapa FRSC yang saya butuhkan untuk mulai?', a: 'Kamu mendapatkan Starter Coin gratis saat mendaftar. Cukup untuk mencoba Anime Generator tanpa perlu membeli apapun.' },
      { q: 'Apa bedanya FRSC dengan cryptocurrency?', a: 'FRSC bukan cryptocurrency. FRSC tidak terdesentralisasi, tidak bisa diperdagangkan di bursa, dan tidak memiliki nilai spekulatif. FRSC murni utility point.' },
    ],
  },
  en: {
    badge: 'FRSC',
    heading: 'FRSC — Farisium Coin',
    description: 'FRSC is the official utility point of the Farisium ecosystem. Used to access AI services, claim rewards, and participate in various programs. FRSC is not a currency and not an investment instrument.',
    usageTitle: 'How to Use FRSC',
    usages: [
      { icon: Wand2, title: 'Anime Generator', desc: '1 FRSC per image' },
      { icon: Globe, title: 'Website Builder', desc: '30–100 FRSC per page' },
      { icon: Headphones, title: 'F-Stream Spotify', desc: 'Packages from 500 FRSC' },
      { icon: FileText, title: 'SEO Caption Generator', desc: 'Free' },
    ],
    waysTitle: 'How to Earn FRSC',
    ways: [
      { title: 'Starter Coin', desc: 'Free FRSC when you first register.' },
      { title: 'Daily Reward', desc: '+1 free FRSC every 24 hours.' },
      { title: 'Referral', desc: 'FRSC bonus for every new user you refer.' },
      { title: 'Loyalty Reward', desc: 'Bonus based on account age and activity.' },
      { title: 'Official Events', desc: 'Farisium events periodically award extra FRSC.' },
      { title: 'FRSC Packages', desc: 'Purchase FRSC packages to support platform development.' },
    ],
    cta: 'Claim Rewards Now',
    disclaimerTitle: 'Important Notice',
    disclaimerText: 'FRSC is a utility point valid only within the Farisium ecosystem. FRSC has no monetary value and cannot be sold, traded, or exchanged for any form of currency. Use of FRSC is subject to the Farisium Terms of Service.',
    faqTitle: 'FAQ',
    faqs: [
      { q: 'Can FRSC be sold or exchanged for money?', a: 'No. FRSC is a utility point that can only be used within the Farisium ecosystem. FRSC has no monetary value and cannot be traded.' },
      { q: 'Can FRSC expire?', a: 'FRSC earned from Rewards does not expire as long as the account is active. Terms may differ for certain packages.' },
      { q: 'How much FRSC do I need to get started?', a: 'You receive a Starter Coin for free when registering. Enough to try the Anime Generator without purchasing anything.' },
      { q: 'What is the difference between FRSC and cryptocurrency?', a: 'FRSC is not a cryptocurrency. FRSC is not decentralized, cannot be traded on exchanges, and has no speculative value. FRSC is purely a utility point.' },
    ],
  },
}

export default async function FRSCPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const params = await searchParams
  const orderId = params.order
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  if (orderId && orderId.startsWith('WB-')) {
    return (
      <>
        <Navbar />
        <WebBuilderCheckout orderId={orderId} initialLang={lang} />
        <SiteFooter />
        <ScrollReveal />
      </>
    )
  }

  const content = pageContent[lang] ?? pageContent.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
                <Coins className="h-3 w-3" aria-hidden="true" />
                {content.badge}
              </span>
              <h1 className="heading-fluid text-h1 text-foreground text-balance">
                {content.heading}
              </h1>
              <p className="mt-4 text-pretty text-lead text-frsc-text-200">
                {content.description}
              </p>
            </div>
            <div className="shrink-0">
              <TopupButton />
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.usageTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.usages.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-5 shadow-metallic`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                  <Icon className="h-5 w-5 text-frsc-crimson-400" />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-frsc-white-bright">{title}</p>
                  <p className="mt-0.5 text-xs text-frsc-text-200">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ways to get */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.waysTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.ways.map(({ title, desc }, i) => (
              <div key={title} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-5 shadow-metallic`}>
                <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{title}</h3>
                <p className="mt-1 text-sm text-frsc-text-200">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/rewards"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
            >
              {content.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-frsc-surface-900 p-6 shadow-metallic">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-frsc-crimson-400" aria-hidden="true" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.disclaimerTitle}</h3>
              <p className="mt-1 text-sm text-frsc-text-200">{content.disclaimerText}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-4 pb-20 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.faqTitle}</h2>
          <div className="flex flex-col gap-3">
            {content.faqs.map(({ q, a }, i) => (
              <div key={q} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic`}>
                <h3 className="text-sm font-semibold text-frsc-white-bright">{q}</h3>
                <p className="mt-2 text-sm text-frsc-text-200">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
