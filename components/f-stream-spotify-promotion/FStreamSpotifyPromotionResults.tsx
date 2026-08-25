'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useLang } from '@/hooks/useLang'
import { TrendingUp, Users, Music, BarChart3, Globe, Disc3 } from 'lucide-react'

const content = {
  id: {
    eyebrow: 'Testimoni Nyata',
    title: 'Testimoni Hasil Boost',
    desc: 'Lihat bagaimana kampanye nyata berperforma di berbagai genre. Hasil aktual dapat bervariasi.',
    campaign: 'kampanye',
    disclaimer:
      '* Hasil hanya ilustrasi. Hasil kampanye aktual dapat bervariasi tergantung genre, kualitas lagu, dan kecocokan audiens.',
  },
  en: {
    eyebrow: 'Real Testimonials',
    title: 'Boost Results Testimonials',
    desc: 'See how real campaigns performed across different genres. Actual results may vary.',
    campaign: 'campaign',
    disclaimer:
      '* Results are for illustration only. Actual campaign results may vary depending on genre, song quality, and audience fit.',
  },
}

const results = [
  {
    genre: 'Pop / Indie',
    duration: '7 days',
    before: {
      label: { id: 'Sebelum Kampanye', en: 'Before Campaign' },
      streams: '2,340',
      listeners: '180',
      saves: '45',
      playlistReach: '1,200',
    },
    after: {
      label: { id: 'Setelah Kampanye', en: 'After Campaign' },
      streams: '3,890',
      listeners: '520',
      saves: '120',
      playlistReach: '4,800',
    },
    growth: '+66%',
    accent: 'crimson' as const,
  },
  {
    genre: 'Hip-Hop',
    duration: '10 days',
    before: {
      label: { id: 'Pertumbuhan Audiens', en: 'Audience Growth' },
      streams: '1,800',
      listeners: '95',
      saves: '28',
      playlistReach: '890',
    },
    after: {
      label: { id: 'Pertumbuhan Stream', en: 'Stream Growth' },
      streams: '3,100',
      listeners: '410',
      saves: '95',
      playlistReach: '3,600',
    },
    growth: '+72%',
    accent: 'purple' as const,
  },
  {
    genre: 'EDM',
    duration: '8 days',
    before: {
      label: { id: 'Data Pendengar', en: 'Listener Data' },
      streams: '4,100',
      listeners: '260',
      saves: '72',
      playlistReach: '2,300',
    },
    after: {
      label: { id: 'Pelacakan Kampanye', en: 'Campaign Tracking' },
      streams: '5,600',
      listeners: '580',
      saves: '165',
      playlistReach: '5,900',
    },
    growth: '+37%',
    accent: 'crimson' as const,
  },
]

function MetricBar({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] text-frsc-text-300/70">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  )
}

function DummyScreenshot({
  label,
  streams,
  listeners,
  saves,
  playlistReach,
  accent,
}: {
  label: string
  streams: string
  listeners: string
  saves: string
  playlistReach: string
  accent: 'crimson' | 'purple'
}) {
  const accentColor =
    accent === 'crimson'
      ? 'border-frsc-crimson-500/20 bg-frsc-crimson-900/10'
      : 'border-frsc-purple-500/20 bg-frsc-purple-900/10'
  const iconColor =
    accent === 'crimson' ? 'text-frsc-crimson-400' : 'text-frsc-purple-400'
  const chartColor =
    accent === 'crimson' ? 'bg-frsc-crimson-500/30' : 'bg-frsc-purple-500/30'

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full ${chartColor}`} />
        <span className="text-[10px] font-medium text-frsc-text-200">
          {label}
        </span>
      </div>

      <div
        className={`aspect-[3/4] rounded-xl border ${accentColor} p-3 shadow-sm`}
      >
        <div className="mb-3 flex items-end justify-between gap-1">
          {[35, 55, 42, 70, 48, 62, 80, 50, 68, 45].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background:
                  accent === 'crimson'
                    ? `rgba(224,48,78,${0.2 + (h / 100) * 0.4})`
                    : `rgba(100,47,127,${0.2 + (h / 100) * 0.4})`,
                minHeight: '4px',
              }}
            />
          ))}
        </div>

        <div className="space-y-1.5">
          <MetricBar label="Streams" value={streams} color={iconColor} />
          <MetricBar label="Listeners" value={listeners} color={iconColor} />
          <MetricBar label="Saves" value={saves} color={iconColor} />
          <MetricBar label="Playlist Reach" value={playlistReach} color={iconColor} />
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {['ID', 'US', 'JP', 'KR', 'GB'].map((loc) => (
            <span
              key={loc}
              className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[8px] text-frsc-text-300/60"
            >
              {loc}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FStreamSpotifyPromotionResults() {
  const { lang } = useLang()
  const c = content[lang] ?? content.id

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 lg:px-6">
      <div className="mb-12 text-center">
        <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">
          {c.eyebrow}
        </span>
        <h2 className="heading-fluid text-h1 text-frsc-white-bright mt-3">
          {c.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-lead text-frsc-text-200">
          {c.desc}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {results.map((result, i) => {
          const icons = [Music, Disc3, BarChart3]
          const IconComponent = icons[i]
          const beforeLabel = result.before.label[lang] ?? result.before.label.id
          const afterLabel = result.after.label[lang] ?? result.after.label.id

          return (
            <div
              key={result.genre}
              className={`reveal-on-scroll reveal-stagger ${['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'][i]}`}
            >
              <GlassCard
                variant="default"
                blur="medium"
                withReflection
                withAccent={result.accent}
                className="p-5"
              >
                <div className="relative z-[2]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/20">
                        <IconComponent className="h-4 w-4 text-frsc-crimson-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-frsc-white-bright">
                          {result.genre}
                        </h3>
                        <span className="text-[10px] text-frsc-text-300/60">
                          {result.duration} {c.campaign}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-[10px] font-bold text-green-400">
                        {result.growth}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <DummyScreenshot
                      label={beforeLabel}
                      streams={result.before.streams}
                      listeners={result.before.listeners}
                      saves={result.before.saves}
                      playlistReach={result.before.playlistReach}
                      accent={result.accent}
                    />
                    <DummyScreenshot
                      label={afterLabel}
                      streams={result.after.streams}
                      listeners={result.after.listeners}
                      saves={result.after.saves}
                      playlistReach={result.after.playlistReach}
                      accent={result.accent}
                    />
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        })}
      </div>

      <div className="reveal-on-scroll reveal-stagger reveal-delay-4 mt-6 text-center">
        <p className="text-xs text-frsc-text-300/50">{c.disclaimer}</p>
      </div>

      <ScrollReveal />
    </section>
  )
}
