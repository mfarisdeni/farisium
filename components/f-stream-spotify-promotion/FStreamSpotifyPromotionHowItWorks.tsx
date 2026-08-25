'use client'

import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useLang } from '@/hooks/useLang'

const content = {
  id: {
    eyebrow: 'Cara Kerja',
    title: 'Mulai Kampanye dalam 5 Langkah Mudah',
    desc: 'Dari pengajuan hingga hasil — bantu musikmu didengar oleh pendengar asli di seluruh dunia.',
    steps: [
      {
        number: '01',
        title: 'Kirim link lagu Spotify-mu',
        description:
          'Submit link track Spotify-mu beserta nama artis dan genre. Pastikan lagumu sudah rilis di Spotify.',
      },
      {
        number: '02',
        title: 'Farisium review genre dan audiens',
        description:
          'Tim kami mereview lagumu untuk memastikan audiens dan kategori kurator yang tepat demi performa kampanye optimal.',
      },
      {
        number: '03',
        title: 'Konfigurasi kampanye dan konfirmasi pembayaran',
        description:
          'Setelah review disetujui, konfirmasi pembayaran via IDR atau FRSC. Kampanye siap dijadwalkan.',
      },
      {
        number: '04',
        title: 'Kampanye berjalan selama 7–10 hari',
        description:
          'Lagu masuk ke kampanye pendengar global dengan curator pitching nyata dan penargetan audiens berbasis AI.',
      },
      {
        number: '05',
        title: 'Pantau progres dan ringkasan hasil',
        description:
          'Pantau progres kampanye melalui dashboard dan terima ringkasan hasil lengkap setelah selesai.',
      },
    ],
  },
  en: {
    eyebrow: 'How It Works',
    title: 'Start Your Campaign in 5 Simple Steps',
    desc: 'From submission to results — get your music heard by real listeners worldwide.',
    steps: [
      {
        number: '01',
        title: 'Submit your Spotify track',
        description:
          'Submit your Spotify track link along with your artist name and genre. Make sure your track is live on Spotify.',
      },
      {
        number: '02',
        title: 'Farisium reviews your genre and audience fit',
        description:
          'Our team reviews your track to ensure it matches the right audience and curator categories for optimal campaign performance.',
      },
      {
        number: '03',
        title: 'Campaign setup and payment confirmation',
        description:
          'After review approval, confirm your payment via IDR or FRSC. Your campaign is prepared and scheduled.',
      },
      {
        number: '04',
        title: 'Campaign runs for 7–10 days',
        description:
          'Your track enters a worldwide listener campaign with real curator pitching and AI-assisted audience targeting.',
      },
      {
        number: '05',
        title: 'Track campaign progress and result summary',
        description:
          'Monitor your campaign progress through the dashboard and receive a full result summary upon completion.',
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
