import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { PlexusCanvas } from '@/components/home/PlexusCanvas'
import { AgenticSection } from '@/components/home/AgenticSection'
import { FounderSection } from '@/components/home/FounderSection'
import { ComputeSection } from '@/components/home/ComputeSection'
import { WhyFarisiumSection } from '@/components/home/WhyFarisiumSection'
import { BlogSection } from '@/components/home/BlogSection'
import { PartnershipSection } from '@/components/home/PartnershipSection'
import { FAQSection } from '@/components/home/FAQSection'
import { getBlogCategories } from '@/lib/blog'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const path = '/'

  const titles = {
    id: 'Agentic AI Platform by M. Faris Deni K. — Farisium',
    en: 'Agentic AI Platform by M. Faris Deni K. — Farisium',
  }
  const descriptions = {
    id: 'Farisium adalah platform Agentic AI karya M. Faris Deni K. — AI agents yang mengekstrak struk ke Excel, mengotomatisasi pekerjaan, dan menyelesaikan tugas nyata dengan akurasi tinggi.',
    en: 'Farisium is an Agentic AI platform built by M. Faris Deni K. — AI agents that turn receipts into Excel, automate real work, and get things done accurately.',
  }
  const keywords = [
    'agentic AI',
    'AI agent',
    'AI platform',
    'M. Faris Deni K.',
    'AI tools',
    'receipt to excel AI',
    'artificial intelligence',
    'Farisium',
    'AI automation',
  ]
  const canonicalUrl = getCanonicalUrl(lang, path)
  const alternates = getHreflangLinks(path, lang)
  return {
    title: { default: titles[lang], template: '%s | Farisium' },
    description: descriptions[lang],
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(alternates.map((a) => [a.lang, a.href])),
    },
    openGraph: {
      type: 'website',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      url: canonicalUrl,
      siteName: 'Farisium',
      title: titles[lang],
      description: descriptions[lang],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Farisium — Agentic AI Platform' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const categories = getBlogCategories(lang)

  const hero = {
    id: {
      badge: 'Agentic AI · Platform by M. Faris Deni K.',
      heading: 'Agen AI yang',
      headingAccent: 'Menyelesaikan Pekerjaan Nyata',
      description:
        'Farisium adalah platform Agentic AI yang dibangun oleh M. Faris Deni K. — agen cerdas yang membaca, mengekstrak, memvalidasi, dan menghasilkan output siap pakai, seperti mengubah foto struk menjadi file Excel yang rapi.',
      ctaPrimary: 'Jelajahi AI Agent',
      ctaSecondary: 'Coba Struk Belanja ke Excel',
      stats: [
        { value: 'Agent AI', label: 'Live & terus bertambah' },
        { value: 'Ekstraksi', label: 'Dua tahap, akurasi terverifikasi' },
        { value: 'Data', label: 'Dihapus otomatis setelah selesai' },
      ],
    },
    en: {
      badge: 'Agentic AI · Platform by M. Faris Deni K.',
      heading: 'AI Agents That',
      headingAccent: 'Get Real Work Done',
      description:
        'Farisium is an Agentic AI platform built by M. Faris Deni K. — intelligent agents that read, extract, validate, and produce ready-to-use output, like turning a receipt photo into a clean Excel file.',
      ctaPrimary: 'Explore AI Agents',
      ctaSecondary: 'Try Image Receipt to Excel',
      stats: [
        { value: 'AI Agents', label: 'Live & growing' },
        { value: 'Extraction', label: 'Two-stage, verified accuracy' },
        { value: 'Data', label: 'Auto-deleted when done' },
      ],
    },
  }

  const h = hero[lang] ?? hero.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar categories={categories} />
      <main className="flex-1">
        {/* Hero — simple, agentic-AI focused */}
        <section className="hero-bg relative overflow-hidden">
          <div className="hero-orb pointer-events-none" aria-hidden="true" />
          <PlexusCanvas className="hero-plexus" />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-20 pt-16 text-center lg:px-6 lg:pb-28 lg:pt-24">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-frsc-crimson-500/20 bg-frsc-crimson-500/[0.04] py-1.5 pl-2.5 pr-4 text-[13px] font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-frsc-crimson-500 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-frsc-crimson-500" />
              </span>
              {h.badge}
            </span>

            <h1 className="mt-8 max-w-3xl text-balance text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold leading-[1.08] tracking-tight text-foreground">
              {h.heading}{' '}
              <span className="animated-gradient-text bg-clip-text text-transparent">
                {h.headingAccent}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {h.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${lang}/ai`}
                className="inline-flex items-center gap-2 rounded-xl bg-frsc-crimson-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(224,48,78,0.55)] transition-all duration-200 hover:-translate-y-px hover:bg-frsc-crimson-600"
              >
                {h.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${lang}/ai/receipt-to-excel`}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-foreground/20 hover:bg-surface-hover"
              >
                {h.ctaSecondary}
              </Link>
            </div>

            <div className="mt-12 flex w-full max-w-2xl flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-border">
              {h.stats.map((s) => (
                <div
                  key={s.value}
                  className="flex flex-1 flex-col items-center gap-1 px-6 py-2"
                >
                  <div className="text-sm font-semibold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agentic AI — dedicated section highlighting the newest tool */}
        <AgenticSection lang={lang} />

        {/* Meet the founder */}
        <FounderSection lang={lang} />

        {/* AI Compute */}
        <ComputeSection lang={lang} />

        {/* Why Farisium */}
        <WhyFarisiumSection lang={lang} />

        {/* Blog — only 3 latest posts */}
        <BlogSection lang={lang} />

        {/* Partnership */}
        <PartnershipSection lang={lang} />

        {/* FAQ */}
        <FAQSection lang={lang} />
      </main>

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}