import Link from 'next/link'
import { ArrowRight, Users, Coins, Heart } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Lang } from '@/lib/translations'

interface Props {
  lang?: Lang
}

export function PartnershipSection({ lang = 'id' }: Props) {
  const labels = {
    id: {
      badge: 'Partnership',
      heading: 'Tumbuh Bersama Farisium',
      description: 'Program Partnership Farisium dibangun di atas prinsip kolaborasi, kontribusi, dan komunitas — bukan investasi.',
      benefits: [
        { icon: Users, title: 'Komunitas', desc: 'Bergabung dengan komunitas pengguna Farisium yang aktif.' },
        { icon: Coins, title: 'Bonus FRSC', desc: 'Dapatkan bonus FRSC eksklusif dari program Partnership.' },
        { icon: Heart, title: 'Kontribusi', desc: 'Berkontribusi pada pertumbuhan ekosistem AI Indonesia.' },
      ],
      cta: 'Pelajari Partnership',
    },
    en: {
      badge: 'Partnership',
      heading: 'Grow with Farisium',
      description: 'The Farisium Partnership program is built on collaboration, contribution, and community — not investment.',
      benefits: [
        { icon: Users, title: 'Community', desc: 'Join the active Farisium user community.' },
        { icon: Coins, title: 'FRSC Bonus', desc: 'Earn exclusive FRSC bonuses from the Partnership program.' },
        { icon: Heart, title: 'Contribution', desc: 'Contribute to the growth of the AI ecosystem.' },
      ],
      cta: 'Learn About Partnership',
    },
  }

  const label = labels[lang] ?? labels.id
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:px-6" aria-labelledby="partnership-heading">
      <GlassCard
        variant="premium"
        blur="medium"
        withReflection={true}
        withAccent="crimson"
        withShimmer={true}
        className="p-8 md:p-14 text-center transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="relative z-[2]">
          <span className="kicker mb-4">
            <span className="kicker-line" aria-hidden="true" />
            {label.badge}
          </span>
          <h2 id="partnership-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
            {label.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base text-frsc-text-300">
            {label.description}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {label.benefits.map(({ icon: Icon, title, desc }) => (
              <GlassCard
                key={title}
                variant="subtle"
                blur="light"
                withReflection={true}
                withAccent="crimson"
                className="group/benefit p-6 text-center transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="relative z-[2] mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/20 to-frsc-purple-800/10 ring-1 ring-frsc-crimson-700/30 transition-all duration-300 group-hover/benefit:from-frsc-crimson-800/30 group-hover/benefit:to-frsc-purple-800/20">
                  <Icon className="h-5 w-5 text-frsc-crimson-400 transition-colors duration-300 group-hover/benefit:text-frsc-crimson-300" />
                </div>
                <div className="relative z-[2] mt-4">
                  <p className="font-heading text-sm font-semibold text-frsc-text-100">{title}</p>
                  <p className="mt-1 text-xs text-frsc-text-300">{desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/partnership"
              className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_28px_rgba(224,48,78,0.4)] active:scale-[0.97]"
            >
              {label.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
