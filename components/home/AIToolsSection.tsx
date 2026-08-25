import Link from 'next/link'
import { Wand2, FileText, MessageSquare, Zap, ArrowRight, Headphones, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Lang } from '@/lib/translations'

// Static lookup so Tailwind v4 can detect each `reveal-delay-N` class (no dynamic concat).
const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

interface Props {
  lang?: Lang
}

export function AIToolsSection({ lang = 'id' }: Props) {
  const toolsData = {
    id: {
      tools: [
        {
          icon: Globe,
          name: 'Jasa Pembuatan Website',
          description: 'Website landing page untuk startup, freelancer, bisnis lokal, dan portfolio — mulai Rp 20 ribu/halaman, hemat hingga 80%.',
          href: '/ai/website-builder',
          available: true,
          badge: 'Promo',
          badgeVariant: 'crimson' as const,
        },
        {
          icon: Headphones,
          name: 'F-Stream Boost Spotify Promotion',
          description: 'Tingkatkan streaming Spotify dengan kampanye global, curator pitching, dan AI performance tracking.',
          href: '/ai/f-stream-spotify-promotion',
          available: true,
          badge: 'Live',
          badgeVariant: 'crimson' as const,
        },
        {
          icon: FileText,
          name: 'AI Blog (Tech News)',
          description: 'Baca berita dan wawasan terbaru seputar teknologi, AI, dan perkembangan digital terkini.',
          href: '/blog',
          available: true,
          badge: 'Live',
          badgeVariant: 'crimson' as const,
        },
      ],
      badge: 'AI Tools',
      heading: 'Alat AI yang Kamu Butuhkan',
      description: 'Dari pembuatan gambar hingga penulisan konten — semua tersedia dalam satu platform yang terintegrasi.',
      ctaAvailable: 'Coba Sekarang',
      ctaAll: 'Lihat Semua AI Tools',
    },
    en: {
      tools: [
        {
          icon: Globe,
          name: 'Website Building Service',
          description: 'Landing page websites for startups, freelancers, local businesses, and portfolios — from IDR 20k per page, save up to 80%.',
          href: '/ai/website-builder',
          available: true,
          badge: 'Promo',
          badgeVariant: 'crimson' as const,
        },
        {
          icon: Headphones,
          name: 'F-Stream Boost Spotify Promotion',
          description: 'Boost your Spotify streaming with global campaigns, curator pitching, and AI performance tracking.',
          href: '/ai/f-stream-spotify-promotion',
          available: true,
          badge: 'Live',
          badgeVariant: 'crimson' as const,
        },
        {
          icon: FileText,
          name: 'AI Blog (Tech News)',
          description: 'Read the latest news and insights on technology, AI, and current digital developments.',
          href: '/blog',
          available: true,
          badge: 'Live',
          badgeVariant: 'crimson' as const,
        },
      ],
      badge: 'AI Tools',
      heading: 'AI Tools You Need',
      description: 'From image creation to content writing — all available in one integrated platform.',
      ctaAvailable: 'Try Now',
      ctaAll: 'View All AI Tools',
    },
  }

  const label = toolsData[lang] ?? toolsData.id
  const tools = label.tools
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:px-6" aria-labelledby="ai-tools-heading">
      {/* Subtle background ambient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-frsc-purple-500/5 blur-3xl" />
      </div>

      <div className="mb-14 text-center">
        <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{label.badge}</span>
        <h2 id="ai-tools-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
          {label.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-frsc-text-200">
          {label.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ icon: Icon, name, description, href, available, badge, badgeVariant }, i) => (
          <Link
            key={name}
            href={href}
            aria-disabled={!available}
            className={`group/tool reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} flex flex-col ${!available ? 'opacity-60' : ''}`}
          >
            <GlassCard
              variant="default"
              blur="light"
              withReflection={true}
              withAccent="crimson"
              withShimmer={false}
              className="hover-lift h-full p-6 transition-colors duration-300 hover:border-frsc-crimson-500/30"
            >
              <div className="relative z-[2] flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 transition-all duration-300 group-hover/tool:from-frsc-crimson-800/35 group-hover/tool:to-frsc-purple-800/25 group-hover/tool:ring-frsc-crimson-500/40 shadow-sm">
                  <Icon className="h-5 w-5 text-frsc-crimson-400 transition-colors duration-300 group-hover/tool:text-frsc-crimson-300" />
                </div>
                <Badge variant={badgeVariant} size="sm">{badge}</Badge>
              </div>

              <div className="relative z-[2] mt-4">
                <h3 className="font-heading text-base font-semibold text-frsc-text-100 transition-colors duration-300 group-hover/tool:text-frsc-crimson-300">
                  {name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-frsc-text-200">
                  {description}
                </p>
              </div>

              {available && (
                <div className="relative z-[2] mt-4 flex items-center gap-1 text-xs font-medium text-frsc-crimson-400 transition-all duration-300 group-hover/tool:gap-2">
                  {label.ctaAvailable} <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/tool:translate-x-0.5" />
                </div>
              )}
            </GlassCard>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/ai"
          className="group/btn inline-block"
        >
          <GlassCard
            variant="subtle"
            blur="light"
            withReflection={false}
            withAccent="crimson"
            className="px-5 py-2.5 transition-all duration-300 hover:shadow-metallic-lg active:scale-[0.97]"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-frsc-text-200 transition-colors duration-300 group-hover/btn:text-frsc-platinum">
              {label.ctaAll}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </span>
          </GlassCard>
        </Link>
      </div>
    </section>
  )
}
