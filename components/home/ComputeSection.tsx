import { Cpu, Zap, Server } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Lang } from '@/lib/translations'

interface Props {
  lang?: Lang
}

export function ComputeSection({ lang = 'id' }: Props) {
  const labels = {
    id: {
      badge: 'AI Compute',
      heading1: 'Infrastruktur AI',
      heading2: 'yang Powerful',
      description: 'Farisium AI Compute menghadirkan kekuatan komputasi berbasis GPU self-hosted untuk mendukung seluruh layanan AI dalam ekosistem.',
      features: [
        { icon: Cpu, label: 'Self-Hosted GPU Inference', desc: 'Privasi terjaga, latensi rendah' },
        { icon: Zap, label: 'Low Latency', desc: 'Respons cepat untuk setiap generate' },
        { icon: Server, label: 'Stable & Scalable', desc: 'Infrastruktur yang dapat berkembang' },
      ],
      comingSoon: 'Live',
    },
    en: {
      badge: 'AI Compute',
      heading1: 'AI Infrastructure',
      heading2: 'That\'s Powerful',
      description: 'Farisium AI Compute delivers GPU-based computing power through self-hosted infrastructure to support all AI services in the ecosystem.',
      features: [
        { icon: Cpu, label: 'Self-Hosted GPU Inference', desc: 'Privacy preserved, low latency' },
        { icon: Zap, label: 'Low Latency', desc: 'Fast response for every generate' },
        { icon: Server, label: 'Stable & Scalable', desc: 'Infrastructure that grows with you' },
      ],
      comingSoon: 'Live',
    },
  }

  const label = labels[lang] ?? labels.id
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:px-6" aria-labelledby="compute-heading">
      <GlassCard
        variant="premium"
        blur="medium"
        withReflection={true}
        withAccent="crimson"
        withShimmer={true}
        className="p-8 md:p-14 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="relative z-[2] grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div>
            <span className="kicker mb-4">
              <span className="kicker-line" aria-hidden="true" />
              {label.badge}
            </span>
            <h2 id="compute-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
              {label.heading1}<br className="hidden sm:block" /> {label.heading2}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-frsc-text-300">
              {label.description}
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {label.features.map(({ icon: Icon, label: featLabel, desc }) => (
                <div key={featLabel} className="group/item flex items-start gap-3 transition-all duration-300">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-frsc-crimson-800/20 to-frsc-purple-800/10 transition-all duration-300 group-hover/item:from-frsc-crimson-800/30 group-hover/item:to-frsc-purple-800/20">
                    <Icon className="h-4 w-4 text-frsc-crimson-400 transition-colors duration-300 group-hover/item:text-frsc-crimson-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground transition-colors duration-300 group-hover/item:text-frsc-crimson-300">{featLabel}</p>
                    <p className="text-xs text-frsc-text-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Badge variant="crimson" size="md">{label.comingSoon}</Badge>
            </div>
          </div>

          {/* Visual — orbiting rings with purple accent */}
          <div className="group/compute flex items-center justify-center">
            <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
              {/* Outer rings */}
              <div className="absolute inset-0 rounded-full border border-frsc-crimson-500/15 animate-[orbit-spin_20s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-frsc-purple-500/8 animate-[orbit-spin_14s_linear_infinite_reverse]" />
              <div className="absolute inset-12 rounded-full border border-frsc-crimson-500/15 animate-[orbit-spin_10s_linear_infinite]" />
              {/* Inner purple glow */}
              <div className="absolute inset-16 rounded-full bg-frsc-purple-500/5 blur-xl" />
              {/* Center icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-700/30 transition-all duration-500 group-hover/compute:ring-frsc-crimson-400/30">
                <Cpu className="h-10 w-10 text-frsc-crimson-400 transition-colors duration-500 group-hover/compute:text-frsc-crimson-300" />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
