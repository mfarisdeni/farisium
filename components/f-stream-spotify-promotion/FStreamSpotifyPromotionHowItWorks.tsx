'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useLang } from '@/hooks/useLang'

const content = {
  id: {
    eyebrow: 'Cara Kerja',
    title: 'Mulai Kampanye dalam 5 Langkah Mudah',
    desc: 'Dari pengajuan hingga hasil — AI agent mengurus pitch playlist dan iklan untuk musikmu.',
    steps: [
      {
        number: '01',
        title: 'Kirim link lagu Spotify-mu',
        description:
          'Submit link track Spotify-mu beserta nama artis dan genre. Pastikan lagumu sudah rilis di Spotify.',
      },
      {
        number: '02',
        title: 'AI agent menganalisis & menyusun pitch',
        description:
          'AI agent menganalisis genre, tempo, dan karakter lagumu untuk menyusun pitch dan menentukan kurator playlist yang paling cocok.',
      },
      {
        number: '03',
        title: 'Konfigurasi kampanye dan konfirmasi pembayaran',
        description:
          'Setelah pitch siap, konfirmasi pembayaran via IDR atau FRSC. AI agent menyiapkan dan menjadwalkan kampanye.',
      },
      {
        number: '04',
        title: 'AI agent push playlist & jalankan iklan',
        description:
          'AI agent mengirim lagu ke pitch playlist kurator dan menjalankan iklan tertarget kepada calon pendengar selama 7–10 hari.',
      },
      {
        number: '05',
        title: 'Pantau progres dan ringkasan hasil',
        description:
          'AI agent memantau performa dan menyusun laporan hasil otomatis. Kamu bisa pantau progres di dashboard dan terima ringkasan lengkap setelah selesai.',
      },
    ],
  },
  en: {
    eyebrow: 'How It Works',
    title: 'Start Your Campaign in 5 Simple Steps',
    desc: 'From submission to results — the AI agent handles playlist pitching and ads for your music.',
    steps: [
      {
        number: '01',
        title: 'Submit your Spotify track',
        description:
          'Submit your Spotify track link along with your artist name and genre. Make sure your track is live on Spotify.',
      },
      {
        number: '02',
        title: 'AI agent analyzes & builds the pitch',
        description:
          'The AI agent analyzes your track\'s genre, tempo, and characteristics to build the pitch and pick the playlist curators that fit best.',
      },
      {
        number: '03',
        title: 'Campaign setup and payment confirmation',
        description:
          'Once the pitch is ready, confirm your payment via IDR or FRSC. The AI agent prepares and schedules the campaign.',
      },
      {
        number: '04',
        title: 'AI agent pushes playlists & runs ads',
        description:
          'The AI agent sends your track to curator playlist pitches and runs targeted ads toward potential listeners over 7–10 days.',
      },
      {
        number: '05',
        title: 'Track campaign progress and result summary',
        description:
          'The AI agent monitors performance and produces automatic result reports. Track progress in the dashboard and receive a full summary upon completion.',
      },
    ],
  },
}

export function FStreamSpotifyPromotionHowItWorks() {
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

      <div className="relative grid gap-6 md:grid-cols-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-14 hidden h-px bg-gradient-to-r from-transparent via-frsc-crimson-500/30 to-transparent md:block"
        />

        {c.steps.map((step, i) => (
          <div
            key={step.number}
            className={`reveal-on-scroll reveal-stagger ${['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'][i]}`}
          >
            <GlassCard
              variant="default"
              blur="light"
              withReflection
              withAccent="purple"
              className="relative p-6 text-center"
            >
              <div className="relative z-[2] mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/40 to-frsc-purple-800/30 ring-1 ring-frsc-crimson-500/30 shadow-lg">
                <span className="text-lg font-bold text-frsc-crimson-400">
                  {step.number}
                </span>
              </div>

              <h3 className="relative z-[2] mb-2 text-sm font-semibold text-frsc-white-bright">
                {step.title}
              </h3>
              <p className="relative z-[2] text-xs leading-relaxed text-frsc-text-200">
                {step.description}
              </p>
            </GlassCard>
          </div>
        ))}
      </div>

      <ScrollReveal />
    </section>
  )
}
