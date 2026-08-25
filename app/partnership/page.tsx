import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Users, Coins, Heart, Shield, ArrowRight } from 'lucide-react'
import { DiscordSection } from '@/components/ui/DiscordSection'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const titles = { id: 'Partnership — Farisium', en: 'Partnership — Farisium' }
  const descriptions = {
    id: 'Program Partnership Farisium dibangun di atas prinsip kolaborasi, kontribusi, dan komunitas. Bukan investasi.',
    en: 'Farisium Partnership program is built on collaboration, contribution, and community principles. Not an investment.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/partnership')
  const alternates = getHreflangLinks('/partnership', lang)
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
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Partnership Farisium' }],
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
    badge: 'Partnership',
    heading: 'Tumbuh Bersama Farisium',
    description: 'Program Partnership Farisium dibangun di atas tiga prinsip utama: kolaborasi, kontribusi, dan komunitas — bukan investasi.',
    disclaimerTitle: 'Disclaimer Penting',
    disclaimerText: 'Program Partnership Farisium bukan program investasi. Tidak ada janji keuntungan finansial, return, atau profit dalam bentuk apapun. Semua aktivitas berbasis utilitas dan komunitas semata.',
    benefitsTitle: 'Manfaat Partnership',
    benefits: [
      { icon: Users, title: 'Komunitas Aktif', desc: 'Bergabung dengan komunitas pengguna Farisium yang aktif dan saling mendukung.' },
      { icon: Coins, title: 'Bonus FRSC', desc: 'Dapatkan bonus FRSC eksklusif sebagai bentuk apresiasi kontribusimu.' },
      { icon: Heart, title: 'Kontribusi Nyata', desc: 'Berkontribusi langsung pada pertumbuhan ekosistem AI di Indonesia.' },
      { icon: Shield, title: 'Bukan Investasi', desc: 'Program ini murni berbasis komunitas dan kontribusi. Tidak ada janji keuntungan finansial.' },
    ],
    statusTitle: 'Program Sedang Dirancang',
    statusText: 'Kami sedang merancang program Partnership yang adil dan transparan. Daftarkan dirimu sekarang untuk mendapatkan notifikasi pertama saat program diluncurkan.',
    statusCta: 'Daftar Sekarang',
    faqTitle: 'FAQ',
    faqs: [
      { q: 'Apakah Partnership memerlukan biaya?', a: 'Tidak. Program Partnership Farisium gratis untuk semua pengguna terdaftar.' },
      { q: 'Apakah ini program investasi?', a: 'Tidak. Partnership Farisium bukan program investasi dalam bentuk apapun. Tidak ada janji return, profit, atau keuntungan finansial. Program ini murni tentang komunitas dan kontribusi.' },
      { q: 'Apa yang dimaksud kontribusi?', a: 'Kontribusi bisa berupa aktif menggunakan platform, memberikan feedback, membantu sesama pengguna di komunitas, atau menyebarkan informasi tentang Farisium.' },
      { q: 'Kapan program Partnership dimulai?', a: 'Program Partnership sedang dalam tahap perancangan dan akan diluncurkan bersamaan dengan fitur-fitur baru Farisium.' },
    ],
  },
  en: {
    badge: 'Partnership',
    heading: 'Grow with Farisium',
    description: 'The Farisium Partnership program is built on three core principles: collaboration, contribution, and community — not investment.',
    disclaimerTitle: 'Important Disclaimer',
    disclaimerText: 'The Farisium Partnership program is not an investment program. There are no promises of financial gain, returns, or profit of any kind. All activities are utility and community-based only.',
    benefitsTitle: 'Partnership Benefits',
    benefits: [
      { icon: Users, title: 'Active Community', desc: 'Join the active Farisium user community with mutual support.' },
      { icon: Coins, title: 'FRSC Bonus', desc: 'Earn exclusive FRSC bonuses as appreciation for your contributions.' },
      { icon: Heart, title: 'Real Contribution', desc: 'Directly contribute to the growth of the AI ecosystem in Indonesia.' },
      { icon: Shield, title: 'Not an Investment', desc: 'This program is purely community and contribution-based. No promises of financial returns.' },
    ],
    statusTitle: 'Program Being Designed',
    statusText: 'We are designing a fair and transparent Partnership program. Register now to get the first notification when the program launches.',
    statusCta: 'Register Now',
    faqTitle: 'FAQ',
    faqs: [
      { q: 'Does Partnership require a fee?', a: 'No. The Farisium Partnership program is free for all registered users.' },
      { q: 'Is this an investment program?', a: 'No. Farisium Partnership is not an investment program in any form. There are no promises of returns, profit, or financial gain. This program is purely about community and contribution.' },
      { q: 'What does contribution mean?', a: 'Contribution can include actively using the platform, providing feedback, helping other users in the community, or spreading information about Farisium.' },
      { q: 'When will the Partnership program start?', a: 'The Partnership program is currently in the design phase and will launch alongside new Farisium features.' },
    ],
  },
}

export default async function PartnershipPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const content = pageContent[lang] ?? pageContent.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
            <Users className="h-3 w-3" aria-hidden="true" />
            {content.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {content.heading}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
            {content.description}
          </p>
        </section>

        {/* Disclaimer banner */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-10 lg:px-6">
          <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-frsc-crimson-400" aria-hidden="true" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.disclaimerTitle}</h3>
              <p className="mt-1 text-sm text-frsc-text-200">{content.disclaimerText}</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.benefitsTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.benefits.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                  <Icon className="h-5 w-5 text-frsc-crimson-400" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{title}</h3>
                  <p className="mt-1 text-sm text-frsc-text-200">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 text-center shadow-metallic">
            <p className="font-heading text-lg font-bold text-frsc-white-bright">{content.statusTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-frsc-text-200">{content.statusText}</p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
            >
              {content.statusCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-4 pb-12 lg:px-6">
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

        <DiscordSection lang={lang} />
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
