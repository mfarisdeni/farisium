'use client'

import Image from 'next/image'
import { Trophy, Award, ExternalLink, Calendar, Flame, Lock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { GlassCard } from '@/components/ui/GlassCard'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

const DISCORD_CHANNEL = 'https://discord.gg/masf4tTvD7'

interface Competition {
  id: string
  name: string
  prize: number
  deadline: string
  bg: string
  active: boolean
}

const competitions: Competition[] = [
  {
    id: 'anime-character-july-1',
    name: 'Anime Character Competition - July #1',
    prize: 100,
    deadline: '2026-07-10',
    bg: '/competitions/anime-character-competition-1.webp',
    active: true,
  },
  {
    id: 'anime-character-july-2',
    name: 'Anime Character Competition - July #2',
    prize: 100,
    deadline: '2026-07-17',
    bg: '/competitions/anime-character-competition-1.webp',
    active: false,
  },
  {
    id: 'anime-character-july-3',
    name: 'Anime Character Competition - July #3',
    prize: 100,
    deadline: '2026-07-24',
    bg: '/competitions/anime-character-competition-1.webp',
    active: false,
  },
  {
    id: 'anime-character-july-4',
    name: 'Anime Character Competition - July #4',
    prize: 100,
    deadline: '2026-07-31',
    bg: '/competitions/anime-character-competition-1.webp',
    active: false,
  },
]

const content = {
  id: {
    badge: 'Kompetisi',
    heading: 'Kompetisi',
    subheading: 'Ikuti kompetisi kreator AI, menangkan hadiah FRSC dan tunjukkan kreativitasmu!',
    prizeLabel: 'Hadiah',
    deadlineLabel: 'Batas Akhir',
    join: 'Ikuti di Discord',
    daysLeft: 'hari lagi',
    active: 'Sedang Berlangsung',
    notStarted: 'Belum Dimulai',
  },
  en: {
    badge: 'Competition',
    heading: 'Competition',
    subheading: 'Join AI creator competitions, win FRSC prizes and show your creativity!',
    prizeLabel: 'Prize',
    deadlineLabel: 'Deadline',
    join: 'Join on Discord',
    daysLeft: 'days left',
    active: 'Ongoing',
    notStarted: 'Not Started',
  },
}

function getDaysLeft(deadline: string): number {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function CompetitionPage() {
  const { lang } = useLang()
  const c = content[lang] ?? content.id

  const handleJoin = () => {
    window.open(DISCORD_CHANNEL, '_blank', 'noopener,noreferrer')
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

          <div className="flex flex-col items-start gap-4">
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 flex items-center gap-1.5">
              <Trophy className="h-3 w-3" aria-hidden="true" />
              {c.badge}
            </span>
            <h1 className="heading-fluid text-h1 text-frsc-white-bright text-balance">
              {c.heading}
            </h1>
            <p className="max-w-xl text-pretty text-lead text-frsc-text-200">
              {c.subheading}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            COMPETITION GRID
            ══════════════════════════════════════════ */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 lg:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((comp) => {
              const daysLeft = getDaysLeft(comp.deadline)

              return (
                <GlassCard
                  key={comp.id}
                  variant="default"
                  blur={comp.active ? 'light' : 'light'}
                  withReflection
                  withAccent={comp.active ? 'crimson' : 'none'}
                  className={cn(
                    'group overflow-hidden !p-0',
                    comp.active ? 'hover-lift' : 'opacity-50 saturate-0',
                  )}
                >
                  {/* Background image */}
                  <div className="relative z-[2] h-48 overflow-hidden bg-black">
                    <img
                      src={comp.bg}
                      alt={comp.name}
                      loading="lazy"
                      className={cn('h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]', comp.active ? 'opacity-100' : 'opacity-60')}
                    />

                    {/* Status badge */}
                    {comp.active ? (
                      <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/15 px-2.5 py-1 text-[10px] font-medium text-green-400 backdrop-blur-sm">
                        <Flame className="h-3 w-3" aria-hidden="true" />
                        {c.active}
                      </div>
                    ) : (
                      <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-frsc-text-300 backdrop-blur-sm">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        {c.notStarted}
                      </div>
                    )}

                    {/* Days left badge (only for active) */}
                    {comp.active && (
                      <div className="absolute right-3 top-3 z-20 rounded-full border border-white/[0.08] bg-black/40 px-2.5 py-1 text-[10px] font-medium text-frsc-text-200 backdrop-blur-sm">
                        {daysLeft} {c.daysLeft}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-[2] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading text-sm font-semibold text-frsc-white-bright leading-snug">
                        {comp.name}
                      </h3>
                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-frsc-crimson-400/60" aria-hidden="true" />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Image src="/farisium-coin.png" alt="" width={16} height={16} className="h-4 w-4" />
                        <span className="text-sm font-bold text-frsc-crimson-400">
                          +{comp.prize.toLocaleString()} FRSC
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-frsc-text-300/50">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        {comp.deadline}
                      </div>
                    </div>

                    {comp.active ? (
                      <button
                        type="button"
                        onClick={handleJoin}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_20px_rgba(224,48,78,0.3)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/40"
                      >
                        {c.join}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </button>
                    ) : (
                      <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 text-xs font-medium text-frsc-text-300/50 backdrop-blur-sm">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        {c.notStarted}
                      </div>
                    )}
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
