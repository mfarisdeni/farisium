import { Shield, Zap, Layers, Coins } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { IconBox } from '@/components/ui/IconBox'
import type { Lang } from '@/lib/translations'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
] as const

interface Props {
  lang?: Lang
}

export function WhyFarisiumSection({ lang = 'id' }: Props) {
  const labels = {
    id: {
      badge: 'Keunggulan',
      heading: 'Mengapa Farisium?',
      description: 'Dibangun dengan prinsip sederhana: mudah digunakan, performa tinggi, dan memberikan manfaat nyata.',
      features: [
        {
          icon: <Layers className="h-5 w-5" />,
          title: 'Ekosistem Terpadu',
          description: 'Satu akun, satu saldo FRSC, semua AI Tools terintegrasi dalam satu platform yang konsisten.',
        },
        {
          icon: <Zap className="h-5 w-5" />,
          title: 'Performa Tinggi',
          description: 'AI inference berjalan di infrastruktur self-hosted dengan latensi rendah dan kualitas output terbaik.',
        },
        {
          icon: <Coins className="h-5 w-5" />,
          title: 'Sistem FRSC',
          description: 'Dapatkan dan gunakan FRSC untuk mengakses layanan AI, klaim reward, dan berpartisipasi dalam ekosistem.',
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: 'Privasi Terjaga',
          description: 'Data dan hasil generate tersimpan aman. Tidak ada pihak ketiga yang memproses kontenmu.',
        },
      ],
    },
    en: {
      badge: 'Advantages',
      heading: 'Why Farisium?',
      description: 'Built on simple principles: easy to use, high performance, and delivering real value.',
      features: [
        {
          icon: <Layers className="h-5 w-5" />,
          title: 'Integrated Ecosystem',
          description: 'One account, one FRSC balance, all AI Tools integrated in one consistent platform.',
        },
        {
          icon: <Zap className="h-5 w-5" />,
          title: 'High Performance',
          description: 'AI inference runs on self-hosted infrastructure with low latency and best quality output.',
        },
        {
          icon: <Coins className="h-5 w-5" />,
          title: 'FRSC System',
          description: 'Earn and use FRSC to access AI services, claim rewards, and participate in the ecosystem.',
        },
        {
          icon: <Shield className="h-5 w-5" />,
          title: 'Privacy Protected',
          description: 'Your data and generated results are securely stored. No third party processes your content.',
        },
      ],
    },
  }

  const label = labels[lang] ?? labels.id
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:px-6" aria-labelledby="why-heading">
      {/* Subtle background ambient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/3 h-48 w-48 -translate-y-1/2 rounded-full bg-frsc-crimson-500/5 blur-3xl" />
        <div className="absolute right-0 bottom-1/3 h-40 w-40 rounded-full bg-frsc-purple-500/4 blur-3xl" />
      </div>

      <div className="mb-14 text-center">
        <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{label.badge}</span>
        <h2 id="why-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
          {label.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-base text-frsc-text-300">
          {label.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {label.features.map(({ icon, title, description }, i) => (
          <GlassCard
            key={title}
            variant="default"
            blur="light"
            withReflection={true}
            withAccent="crimson"
            className={`group/why reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift h-full p-6`}
          >
            <div className="relative z-[2]">
              <IconBox
                icon={icon}
                title={title}
                description={description}
                direction="col"
                className="text-center"
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
