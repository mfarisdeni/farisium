import Link from 'next/link'
import { ReceiptText, Sparkles, Check, ShieldCheck, ArrowRight, Headphones, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Lang } from '@/lib/translations'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
] as const

interface Props {
  lang?: Lang
}

export function AgenticSection({ lang = 'id' }: Props) {
  const labels = {
    id: {
      badge: 'Agentic AI',
      heading: 'Agen AI yang Bekerja untuk Kamu',
      description:
        'Farisium adalah platform Agentic AI karya M. Faris Deni K. — agen cerdas yang membaca, mengekstrak, memvalidasi, dan menyelesaikan pekerjaan nyata secara otomatis. Bukan sekadar chatbot: setiap agen menghasilkan output yang bisa langsung kamu pakai.',
      featuredBadge: 'Tool Terbaru & Terpintar',
      featuredName: 'Struk ke Excel (Receipt to Excel)',
      featuredDescription:
        'Agen AI pertama Farisium yang memahami konteks dokumen. Arahkan kamera ke struk belanja, dan agen membaca setiap baris, mengekstrak item & harga, memvalidasi aritmatika, lalu menyusun file Excel yang rapi — tanpa edit manual.',
      checklist: [
        'Ekstraksi dua tahap dengan akurasi angka terverifikasi',
        'Validasi aritmatika otomatis untuk subtotal, pajak, dan diskon',
        'File dihapus otomatis setelah selesai — privasi terjaga',
      ],
      primaryCta: 'Coba Agen Ini',
      secondaryCta: 'Lihat Semua AI Tools',
      toolCta: 'Buka',
      toolsLabel: 'Garis AI Tools',
      toolsHeading: 'Satu Ekosistem, Semua Agen Farisium',
      tools: [
        {
          icon: Headphones,
          name: 'F-Stream Boost',
          description: 'Kampanye promosi Spotify berbasis AI dengan performance tracking.',
          href: '/ai/f-stream-spotify-promotion',
          badge: 'Live',
        },
        {
          icon: FileText,
          name: 'AI Blog',
          description: 'Wawasan dan berita AI yang ditulis untuk membantu keputusanmu.',
          href: '/blog',
          badge: 'Live',
        },
      ],
    },
    en: {
      badge: 'Agentic AI',
      heading: 'AI Agents That Work for You',
      description:
        'Farisium is an Agentic AI platform built by M. Faris Deni K. — intelligent agents that read, extract, validate, and complete real work automatically. Not just a chatbot: every agent produces output you can actually use.',
      featuredBadge: 'Newest & Smartest Tool',
      featuredName: 'Receipt to Excel',
      featuredDescription:
        'The first Farisium agent that understands document context. Point your camera at a store receipt and the agent reads every line, extracts items & prices, validates the math, and produces a clean Excel file — no manual editing.',
      checklist: [
        'Two-stage extraction with verified number accuracy',
        'Automatic math validation for subtotals, tax, and discounts',
        'Files auto-deleted when done — privacy preserved',
      ],
      primaryCta: 'Try This Agent',
      secondaryCta: 'View All AI Tools',
      toolCta: 'Open',
      toolsLabel: 'AI Tools Line',
      toolsHeading: 'One Ecosystem, All Farisium Agents',
      tools: [
        {
          icon: Headphones,
          name: 'F-Stream Boost',
          description: 'AI-driven Spotify promotion campaigns with performance tracking.',
          href: '/ai/f-stream-spotify-promotion',
          badge: 'Live',
        },
        {
          icon: FileText,
          name: 'AI Blog',
          description: 'AI insights and news written to help you make better decisions.',
          href: '/blog',
          badge: 'Live',
        },
      ],
    },
  }

  const label = labels[lang] ?? labels.id

  return (
    <section
      className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:px-6"
      aria-labelledby="agentic-heading"
    >
      {/* Subtle background ambient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-16 h-72 w-72 rounded-full bg-frsc-crimson-500/[0.06] blur-3xl" />
        <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-frsc-purple-500/[0.05] blur-3xl" />
      </div>

      <div className="mb-14 text-center">
        <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{label.badge}</span>
        <h2 id="agentic-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
          {label.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-frsc-text-200">
          {label.description}
        </p>
      </div>

      {/* Featured agent — Receipt to Excel */}
      <GlassCard
        variant="premium"
        blur="medium"
        withReflection={true}
        withAccent="crimson"
        withShimmer={true}
        className="p-8 md:p-12 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="relative z-[2] grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="kicker mb-0">
                <span className="kicker-line" aria-hidden="true" />
                {label.toolsLabel}
              </span>
              <Badge variant="crimson" size="sm">{label.featuredBadge}</Badge>
            </div>

            <div className="mt-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/30">
                <ReceiptText className="h-6 w-6 text-frsc-crimson-400" />
              </div>
              <h3 className="heading-fluid text-h2 text-frsc-text-100">
                {label.featuredName}
              </h3>
            </div>

            <p className="mt-4 text-pretty text-base leading-relaxed text-frsc-text-200">
              {label.featuredDescription}
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {label.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-frsc-text-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-frsc-crimson-400" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/ai/receipt-to-excel"
                className="group/btn inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_28px_rgba(224,48,78,0.4)] active:scale-[0.97]"
              >
                {label.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
              <Link
                href="/ai"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-frsc-text-100 transition-all duration-300 hover:border-frsc-crimson-500/30 hover:bg-frsc-crimson-900/10 active:scale-[0.97]"
              >
                {label.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Visual — orbiting rings accent */}
          <div className="group/agent flex items-center justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60">
              <div className="absolute inset-0 rounded-full border border-frsc-crimson-500/15 animate-[orbit-spin_20s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-frsc-purple-500/8 animate-[orbit-spin_14s_linear_infinite_reverse]" />
              <div className="absolute inset-12 rounded-full border border-frsc-crimson-500/15 animate-[orbit-spin_10s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full bg-frsc-purple-500/5 blur-xl" />
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-700/30 transition-all duration-500 group-hover/agent:ring-frsc-crimson-400/30">
                <Sparkles className="h-10 w-10 text-frsc-crimson-400 transition-all duration-500 group-hover/agent:text-frsc-crimson-300" />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Supporting agents */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {label.tools.map(({ icon: Icon, name, description, href, badge: b }, i) => (
          <Link
            key={name}
            href={href}
            className={`group/agent reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} flex flex-col`}
          >
            <GlassCard
              variant="default"
              blur="light"
              withReflection={true}
              withAccent="crimson"
              className="hover-lift h-full p-6 transition-colors duration-300 hover:border-frsc-crimson-500/30"
            >
              <div className="relative z-[2] flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 transition-all duration-300 group-hover/agent:ring-frsc-crimson-500/40">
                  <Icon className="h-5 w-5 text-frsc-crimson-400" />
                </div>
                <Badge variant="crimson" size="sm">{b}</Badge>
              </div>
              <div className="relative z-[2] mt-4">
                <h4 className="font-heading text-base font-semibold text-frsc-text-100">{name}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-frsc-text-200">{description}</p>
              </div>
              <div className="relative z-[2] mt-4 flex items-center gap-1 text-xs font-medium text-frsc-crimson-400 transition-all duration-300 group-hover/agent:gap-2">
                {label.toolCta}
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/agent:translate-x-0.5" />
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Privacy note */}
      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-frsc-text-300">
        <ShieldCheck className="h-4 w-4 text-frsc-crimson-400/80" />
        {lang === 'id'
          ? 'Semua file hanya disimpan sementara dan dihapus otomatis setelah diproses.'
          : 'All files are stored temporarily and auto-deleted after processing.'}
      </p>
    </section>
  )
}