import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Lang } from '@/lib/translations'

interface Props {
  lang?: Lang
}

export function FounderSection({ lang = 'id' }: Props) {
  const content = {
    id: {
      eyebrow: 'Pembuat Farisium',
      heading: 'Kenalin, M. Faris Deni K.',
      description:
        'Agentic AI Leader di balik Farisium — merancang dan membangun agen AI yang benar-benar bekerja: membaca dokumen, mengekstrak data, memvalidasi angka, dan menyusun output siap pakai.',
      cta: 'Kenali Lebih Dekat',
      ctaSecondary: 'Tentang Farisium',
    },
    en: {
      eyebrow: 'Founder',
      heading: 'Meet M. Faris Deni K.',
      description:
        'The Agentic AI Leader behind Farisium — designing and building AI agents that actually work: reading documents, extracting data, validating numbers, and producing ready-to-use output.',
      cta: 'Get to Know Him',
      ctaSecondary: 'About Farisium',
    },
  }

  const t = content[lang] ?? content.id

  return (
    <section
      className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:py-16 lg:px-6"
      aria-labelledby="founder-heading"
    >
      <GlassCard
        variant="default"
        blur="light"
        withReflection={false}
        withAccent="crimson"
        className="relative overflow-hidden p-7 md:p-10"
      >
        <div className="relative z-[2] grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="relative mx-auto md:mx-0">
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-frsc-crimson-500/15 to-frsc-purple-500/10 blur-xl"
            />
            <Image
              src="/faris.webp"
              alt={lang === 'id' ? 'Foto M. Faris Deni K.' : 'Photo of M. Faris Deni K.'}
              width={176}
              height={176}
              className="relative h-40 w-40 rounded-2xl object-cover ring-1 ring-frsc-crimson-500/20"
            />
          </div>

          <div className="text-center md:text-left">
            <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{t.eyebrow}</span>
            <h2 id="founder-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
              {t.heading}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-frsc-text-200 md:mx-0">
              {t.description}
            </p>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href={`/${lang}/author/faris`}
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97]"
              >
                {t.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
              <Link
                href={`/${lang}/about`}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-foreground/20 hover:bg-surface-hover"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}