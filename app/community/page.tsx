import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Users, MessageCircle, Heart, Gift, ArrowRight, Shield } from 'lucide-react'
import { DiscordSection } from '@/components/ui/DiscordSection'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
  'reveal-delay-5',
  'reveal-delay-6',
] as const

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const titles = { id: 'Komunitas — Farisium', en: 'Community — Farisium' }
  const descriptions = {
    id: 'Bergabung dengan komunitas Farisium. Diskusikan AI tools, Anime Generator, reward, dan bertemu dengan pengguna Farisium lainnya.',
    en: 'Join the Farisium community. Discuss AI tools, Anime Generator, rewards, and meet other Farisium users.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/community')
  const alternates = getHreflangLinks('/community', lang)
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: canonicalUrl, languages: Object.fromEntries(alternates.map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: canonicalUrl,
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Komunitas Farisium' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
  }
}

const pageContent = {
  id: {
    badge: 'Komunitas',
    heading: 'Komunitas Farisium',
    description: 'Bergabung dengan ribuan kreator, developer, dan penggemar AI di komunitas Farisium. Diskusikan ide, bagikan hasil karya, dan dapatkan update terbaru.',
    benefitsTitle: 'Mengapa Bergabung?',
    benefits: [
      { icon: MessageCircle, title: 'Diskusi Aktif', desc: 'Tanyakan tips, bagikan prompt terbaik, dan diskusikan hasil generate dengan sesama pengguna.' },
      { icon: Heart, title: 'Dukungan Komunitas', desc: 'Dapatkan bantuan dari anggota komunitas dan tim Farisium secara langsung.' },
      { icon: Gift, title: 'Event & Giveaway', desc: 'Ikuti event eksklusif, kompetisi, dan giveaway khusus anggota komunitas.' },
    ],
    platformsTitle: 'Platform Komunitas',
    platforms: [
      { name: 'Discord', desc: 'Server Discord utama Farisium. Tempat diskusi utama, dukungan teknis, dan pengumuman resmi.', cta: 'Gabung Discord', href: 'https://discord.gg/SCDFEbRpjm' },
    ],
    guidelinesTitle: 'Pedoman Komunitas',
    guidelines: [
      { title: 'Hormati Sesama', desc: 'Perlakukan semua anggota dengan rasa hormat. Tidak ada toleransi untuk pelecehan, diskriminasi, atau ujaran kebencian.' },
      { title: 'Kontribusi Positif', desc: 'Bagikan pengetahuan, bantu sesama, dan berkontribusi untuk menciptakan lingkungan yang mendukung.' },
      { title: 'Ikuti Aturan', desc: 'Patuhi aturan masing-masing platform komunitas. Setiap platform memiliki pedoman spesifik yang harus diikuti.' },
    ],
  },
  en: {
    badge: 'Community',
    heading: 'Farisium Community',
    description: 'Join thousands of creators, developers, and AI enthusiasts in the Farisium community. Discuss ideas, share creations, and get the latest updates.',
    benefitsTitle: 'Why Join?',
    benefits: [
      { icon: MessageCircle, title: 'Active Discussions', desc: 'Ask for tips, share the best prompts, and discuss generate results with fellow users.' },
      { icon: Heart, title: 'Community Support', desc: 'Get help from community members and the Farisium team directly.' },
      { icon: Gift, title: 'Events & Giveaways', desc: 'Participate in exclusive events, competitions, and giveaways for community members.' },
    ],
    platformsTitle: 'Community Platforms',
    platforms: [
      { name: 'Discord', desc: 'The main Farisium Discord server. Primary discussion hub, technical support, and official announcements.', cta: 'Join Discord', href: 'https://discord.gg/SCDFEbRpjm' },
    ],
    guidelinesTitle: 'Community Guidelines',
    guidelines: [
      { title: 'Respect Others', desc: 'Treat all members with respect. There is zero tolerance for harassment, discrimination, or hate speech.' },
      { title: 'Positive Contribution', desc: 'Share knowledge, help others, and contribute to creating a supportive environment.' },
      { title: 'Follow Rules', desc: 'Adhere to each community platform\'s rules. Each platform has specific guidelines that must be followed.' },
    ],
  },
}

export default async function CommunityPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const content = pageContent[lang] ?? pageContent.id

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <span className="eyebrow-label text-eyebrow text-frsc-crimson-400 mb-4 flex items-center gap-1.5">
            <Users className="h-3 w-3" aria-hidden="true" />
            {content.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {content.heading}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
            {content.description}
          </p>
        </section>

        {/* Benefits */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.benefitsTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.benefits.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                  <Icon className="h-5 w-5 text-frsc-crimson-400" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{title}</h3>
                  <p className="mt-1 text-sm text-frsc-text-200">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.platformsTitle}</h2>
          <div className="grid gap-4">
            {content.platforms.map(({ name, desc, cta, href }) => (
              <div key={name} className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
                <div className="flex-1">
                  <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{name}</h3>
                  <p className="mt-1 text-sm text-frsc-text-200">{desc}</p>
                </div>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
                >
                  {cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.guidelinesTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.guidelines.map(({ title, desc }, i) => (
              <div key={title} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic`}>
                <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{title}</h3>
                <p className="mt-2 text-sm text-frsc-text-200">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
