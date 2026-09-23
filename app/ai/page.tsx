import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { FileText, ArrowRight, Headphones, ReceiptText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const titles = { id: 'AI Agents & AI Tools — Farisium', en: 'AI Agents & AI Tools — Farisium' }
  const descriptions = {
    id: 'Jelajahi AI agents dan tools Farisium — Receipt to Excel, F-Stream Spotify, dan lainnya. Semua dalam satu platform agentic AI.',
    en: 'Explore Farisium AI agents and tools — Receipt to Excel, F-Stream Spotify, and more. All in one agentic AI platform.',
  }
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: getCanonicalUrl(lang, '/ai'), languages: Object.fromEntries(getHreflangLinks('/ai', lang).map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: getCanonicalUrl(lang, '/ai'),
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AI Tools Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

const toolsData = {
  id: [
    { icon: ReceiptText, name: 'Struk ke Excel (Receipt to Excel)', description: 'Agen AI terbaru: ubah foto struk atau bukti transaksi menjadi file Excel yang rapi, lengkap dengan validasi angka otomatis.', href: '/ai/receipt-to-excel', available: true, badge: 'Live', badgeVariant: 'crimson' as const },
    { icon: Headphones, name: 'F-Stream Boost Spotify Promotion', description: 'Tingkatkan streaming Spotify-mu dengan kampanye global, curator pitching, dan AI performance tracking.', href: '/ai/f-stream-spotify-promotion', available: true, badge: 'Live', badgeVariant: 'crimson' as const },
    { icon: FileText, name: 'AI Blog (Tech News)', description: 'Baca berita dan wawasan terbaru seputar teknologi, AI, dan perkembangan digital terkini.', href: '/blog', available: true, badge: 'Live', badgeVariant: 'crimson' as const },
  ],
  en: [
    { icon: ReceiptText, name: 'Receipt to Excel', description: 'The newest AI agent: turn a receipt or transaction photo into a clean Excel file, complete with automatic number validation.', href: '/ai/receipt-to-excel', available: true, badge: 'Live', badgeVariant: 'crimson' as const },
    { icon: Headphones, name: 'F-Stream Boost Spotify Promotion', description: 'Boost your Spotify streaming with global campaigns, curator pitching, and AI performance tracking.', href: '/ai/f-stream-spotify-promotion', available: true, badge: 'Live', badgeVariant: 'crimson' as const },
    { icon: FileText, name: 'AI Blog (Tech News)', description: 'Read the latest news and insights on technology, AI, and current digital developments.', href: '/blog', available: true, badge: 'Live', badgeVariant: 'crimson' as const },
  ],
}

const labels = {
  id: { badge: 'AI Tools', heading: 'Semua AI Tools', description: 'Semua layanan AI Farisium tersedia di satu tempat. Pilih tool yang kamu butuhkan dan mulai berkreasi.', cta: 'Coba Sekarang' },
  en: { badge: 'AI Tools', heading: 'All AI Tools', description: 'All Farisium AI services in one place. Pick the tool you need and start creating.', cta: 'Try Now' },
}

export default async function AIDirectoryPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const tools = toolsData[lang] ?? toolsData.id
  const label = labels[lang] ?? labels.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Ambient background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-frsc-crimson-500/[0.04] blur-3xl" />
          <div className="absolute -right-40 top-1/2 h-80 w-80 rounded-full bg-frsc-purple-500/[0.04] blur-3xl" />
        </div>

        {/* Header */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-12 lg:px-6">
          <span className="kicker mb-4">
            <span className="kicker-line" aria-hidden="true" />
            {label.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {label.heading}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lead text-frsc-text-200">
            {label.description}
          </p>
        </section>

        {/* Tools grid */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-24 lg:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ icon: Icon, name, description, href, badge, badgeVariant }) => (
                <Link
                  key={name}
                  href={href}
                  className="group relative cursor-pointer"
                >
                  {/* Glow effect behind card */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-frsc-crimson-500/10 to-frsc-purple-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="glass-base-light glass-shadow relative overflow-hidden rounded-2xl border border-frsc-crimson-500/20 p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-frsc-crimson-500/40 group-hover:shadow-metallic-lg">
                    {/* Reflection overlay */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-inherit glass-reflection" />

                    {/* Ambient crimson */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-inherit glass-ambient-crimson" />

                    <div className="relative z-[2]">
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/30 shadow-sm transition-all duration-300 group-hover:from-frsc-crimson-800/40 group-hover:to-frsc-purple-800/30 group-hover:ring-frsc-crimson-500/50 group-hover:shadow-frsc-crimson-500/20">
                          <Icon className="h-5 w-5 text-frsc-crimson-400 transition-colors duration-300 group-hover:text-frsc-crimson-300" />
                        </div>
                        <Badge variant="crimson" size="sm">{badge}</Badge>
                      </div>

                      <div className="mt-5">
                        <h2 className="font-heading text-base font-semibold text-frsc-white-bright transition-colors duration-300 group-hover:text-frsc-crimson-100">
                          {name}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-frsc-text-200">
                          {description}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-frsc-crimson-400 transition-all duration-300 group-hover:gap-2.5 group-hover:text-frsc-crimson-300">
                        {label.cta}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
