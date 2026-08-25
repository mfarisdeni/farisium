import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'
import ContactForm from '@/components/contact/ContactForm'

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
  const titles = { id: 'Kontak — Farisium', en: 'Contact — Farisium' }
  const descriptions = {
    id: 'Hubungi tim Farisium. Kami siap membantu menjawab pertanyaan, saran, dan kolaborasi.',
    en: 'Contact the Farisium team. We are ready to help answer questions, suggestions, and collaborations.',
  }
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: getCanonicalUrl(lang, '/contact'), languages: Object.fromEntries(getHreflangLinks('/contact', lang).map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: getCanonicalUrl(lang, '/contact'),
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kontak Farisium' }],
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
    badge: 'Kontak',
    heading: 'Hubungi Kami',
    description: 'Punya pertanyaan, saran, atau ingin berkolaborasi? Tim Farisium siap mendengar dan membantu.',
    formTitle: 'Kirim Pesan',
    contactTitle: 'Informasi Kontak',
    contactItems: [
      { icon: Mail, title: 'Email', desc: 'hello@farisium.com', href: 'mailto:hello@farisium.com' },
      { icon: MessageSquare, title: 'Discord', desc: 'Gabung komunitas Discord kami', href: 'https://discord.gg/SCDFEbRpjm' },
    ],
    responseTitle: 'Waktu Respons',
    responseItems: [
      { icon: Clock, title: 'Email', desc: '1-2 hari kerja' },
      { icon: Clock, title: 'Discord', desc: 'Beberapa jam - 1 hari' },
    ],
    faqTitle: 'Pertanyaan Umum',
    faqs: [
      { q: 'Bagaimana cara melaporkan bug?', a: 'Laporkan bug melalui Discord kami di channel #bug-report. Sertakan informasi detail seperti langkah-langkah mereproduksi, screenshot, dan browser yang digunakan.' },
      { q: 'Apakah Farisium menyediakan API publik?', a: 'Saat ini API publik masih dalam tahap pengembangan. Ikuti pengumuman di Discord untuk informasi terbaru.' },
      { q: 'Bagaimana cara menjadi partner?', a: 'Silakan kunjungi halaman Partnership untuk informasi lebih lanjut tentang program partnership Farisium.' },
    ],
  },
  en: {
    badge: 'Contact',
    heading: 'Get in Touch',
    description: 'Have questions, suggestions, or want to collaborate? The Farisium team is ready to listen and help.',
    formTitle: 'Send a Message',
    contactTitle: 'Contact Information',
    contactItems: [
      { icon: Mail, title: 'Email', desc: 'hello@farisium.com', href: 'mailto:hello@farisium.com' },
      { icon: MessageSquare, title: 'Discord', desc: 'Join our Discord community', href: 'https://discord.gg/SCDFEbRpjm' },
    ],
    responseTitle: 'Response Time',
    responseItems: [
      { icon: Clock, title: 'Email', desc: '1-2 business days' },
      { icon: Clock, title: 'Discord', desc: 'A few hours - 1 day' },
    ],
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'How do I report a bug?', a: 'Report bugs through our Discord in the #bug-report channel. Include detailed information such as reproduction steps, screenshots, and browser used.' },
      { q: 'Does Farisium provide a public API?', a: 'The public API is currently under development. Follow announcements on Discord for the latest updates.' },
      { q: 'How do I become a partner?', a: 'Please visit the Partnership page for more information about the Farisium partnership program.' },
    ],
  },
}

export default async function ContactPage() {
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
            <Mail className="h-3 w-3" aria-hidden="true" />
            {content.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {content.heading}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
            {content.description}
          </p>
        </section>

        {/* Contact form + info grid */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Form */}
            <div>
              <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.formTitle}</h2>
              <ContactForm lang={lang} />
            </div>

            {/* Info sidebar */}
            <div className="space-y-8">
              <div>
                <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.contactTitle}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.contactItems.map(({ icon: Icon, title, desc, href }, i) => (
                    <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic transition-all duration-200 hover:border-frsc-crimson-500/30`}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                        <Icon className="h-5 w-5 text-frsc-crimson-400" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{title}</h3>
                        <p className="mt-1 text-sm text-frsc-text-200">{desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.responseTitle}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.responseItems.map(({ icon: Icon, title, desc }, i) => (
                    <div key={title} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic`}>
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
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-3xl px-4 pb-20 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.faqTitle}</h2>
          <div className="flex flex-col gap-3">
            {content.faqs.map(({ q, a }, i) => (
              <div key={q} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} hover-lift rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic`}>
                <h3 className="text-sm font-semibold text-frsc-white-bright">{q}</h3>
                <p className="mt-2 text-sm text-frsc-text-200">{a}</p>
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
