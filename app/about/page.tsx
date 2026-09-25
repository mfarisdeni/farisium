import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Info, Target, Eye, Heart, Shield, Mail, Lightbulb, Brain, Coins, Gift, Handshake, Map, Rocket } from 'lucide-react'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'
import { RenderMarkdownLinks } from '@/components/ui/RenderMarkdownLinks'

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
  const titles = { id: 'Tentang Kami — Farisium', en: 'About Us — Farisium' }
  const descriptions = {
    id: 'Pelajari lebih lanjut tentang Farisium, platform Agentic AI karya M. Faris Deni K. — AI agents yang mengekstrak data dari dokumen, memvalidasi angka, dan menyelesaikan pekerjaan nyata secara otomatis.',
    en: 'Learn more about Farisium, the Agentic AI platform built by M. Faris Deni K. — AI agents that extract data from documents, validate numbers, and complete real work automatically.',
  }
  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: getCanonicalUrl(lang, '/about'), languages: Object.fromEntries(getHreflangLinks('/about', lang).map(a => [a.lang, a.href])) },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: getCanonicalUrl(lang, '/about'),
      siteName: 'Farisium',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tentang Farisium' }],
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
    badge: 'Tentang Kami',
    heading: 'Mengenal Farisium',
    description: 'Farisium adalah platform Agentic AI yang merancang kecerdasan buatan untuk benar-benar bekerja — membaca dokumen, mengekstrak data, memvalidasi angka, dan menuntaskan pekerjaan nyata secara otomatis.',
    apaTitle: 'Apa itu Farisium?',
    apaText: 'Farisium adalah platform Agentic AI karya M. Faris Deni K. yang dirancang untuk merevolusi cara kerja kamu. Alih-alih sekadar chatbot atau generator gambar, Farisium menghadirkan AI agents yang bekerja seperti asisten profesional: membaca struk belanja dan mengubahnya menjadi Excel yang valid, mengubah foto invoice menjadi invoice digital siap pakai, hingga mengelola kampanye promosi musik secara mandiri.\n\nKami percaya bahwa masa depan AI bukan sekadar menjawab pertanyaan — AI harus menyelesaikan pekerjaan. Farisium dibangun untuk menjembatani kesenjangan antara kecerdasan buatan dan operasional bisnis nyata, dengan antarmuka yang sederhana, biaya yang terjangkau, dan ekosistem yang terus berkembang.',
    founderTitle: 'Di Balik Farisium',
    founderName: 'M. Faris Deni K.',
    founderRole: 'Agentic AI Leader',
    founderText: 'Farisium dipimpin oleh M. Faris Deni K., seorang Agentic AI Leader yang merancang dan membangun platform AI mandiri untuk pekerjaan yang lebih cerdas — mengubah operasional bisnis menjadi efisiensi bertenaga AI yang skalabel. Dengan latar belakang di bidang pengembangan web dan arsitektur AI, Faris membangun agen-agen AI yang benar-benar melakukan pekerjaan nyata: membaca dokumen, mengekstrak data, memvalidasi hasil, dan menyusun output siap pakai.',
    visiTitle: 'Visi',
    visiText: 'Menjadi platform AI terdepan yang memberdayakan kreator dan bisnis di Indonesia serta Asia Tenggara melalui teknologi kecerdasan buatan yang mudah diakses, terjangkau, dan bermanfaat bagi semua.',
    misiTitle: 'Misi',
    misiItems: [
      { icon: Target, title: 'Akses AI untuk Semua', desc: 'Membuat teknologi AI mudah diakses oleh siapa saja, tanpa perlu latar belakang teknis.' },
      { icon: Heart, title: 'Ekonomi Kreator', desc: 'Membangun ekosistem di mana kreator bisa mendapatkan nilai dari kontribusi mereka.' },
      { icon: Shield, title: 'Teknologi Bertanggung Jawab', desc: 'Mengembangkan AI yang etis, transparan, dan bermanfaat bagi masyarakat.' },
      { icon: Rocket, title: 'Inovasi Berkelanjutan', desc: 'Terus menghadirkan fitur dan tools baru yang relevan dengan kebutuhan pengguna.' },
    ],
    ecosystemTitle: 'Digital Creative Ecosystem',
    ecosystemText: 'Farisium bukan sekadar kumpulan tools AI — kami membangun ekosistem agentic AI yang saling terhubung. Setiap agen dirancang untuk menyelesaikan satu pekerjaan nyata dengan hasil yang bisa langsung dipakai: dari ekstraksi struk belanja, pembuatan invoice, hingga kampanye promosi musik. Semuanya terintegrasi dalam satu platform dengan sistem reward berbasis FRSC dan komunitas yang terus bertumbuh.',
    toolsTitle: 'Agentic AI',
    toolsText: 'AI agents Farisium dirancang untuk bekerja, bukan sekadar berdiskusi. Agent pertama kami mengubah foto struk belanja menjadi file Excel yang rapi dan tervalidasi, agent kedua mengubah foto invoice menjadi invoice digital profesional lengkap dengan PDF dan Excel, dan masih banyak lagi yang sedang dikembangkan. Setiap agent dirancang dengan prinsip sederhana, akurat, dan siap menghasilkan output final. Kunjungi halaman [[Agentic AI](/ai)] untuk melihat daftar lengkap.',
    frscTitle: 'FRSC (Farisium Coin)',
    frscText: 'FRSC adalah token utilitas internal Farisium yang digunakan untuk mengakses layanan premium di seluruh platform. Baik itu konversi struk belanja, pembuatan invoice digital, hingga kampanye promosi musik — FRSC memungkinkan semua pengguna menikmati layanan AI premium secara adil dan berkelanjutan. Dapatkan FRSC gratis melalui sistem Rewards harian dan berbagai event kompetisi.',
    rewardsTitle: 'Rewards',
    rewardsText: 'Sistem Rewards Farisium memberikan kesempatan kepada setiap pengguna untuk mendapatkan FRSC gratis setiap hari. Cukup kunjungi halaman Rewards, klaim bonus harian Anda, dan gunakan FRSC untuk mengakses berbagai fitur AI premium. Kami percaya bahwa dengan sistem reward yang adil, lebih banyak orang bisa merasakan manfaat AI tanpa hambatan biaya. Mulai klaim di halaman [[Rewards](/rewards)].',
    partnershipTitle: 'Partnership',
    partnershipText: 'Farisium membuka peluang partnership bagi kreator, pengembang, institusi pendidikan, dan bisnis yang ingin berkolaborasi. Program partnership mencakup integrasi teknologi, kolaborasi konten, riset bersama, dan berbagai bentuk kemitraan strategis lainnya. Tertarik menjadi mitra? Kunjungi halaman [[Partnership](/partnership)] untuk informasi lebih lanjut.',
    roadmapTitle: 'Roadmap',
    roadmapQuarter: 'Kuarter',
    roadmapPhases: [
      { phase: 'Q1 2026', title: 'Fondasi & Riset Awal', items: ['Riset dan perencanaan arsitektur platform', 'Pengembangan fondasi produk dan desain', 'Peluncuran versi alpha website', 'Uji coba internal dan bug fixing'] },
      { phase: 'Q2 2026', title: 'Agentic AI Pertama & Ekosistem', items: ['Peluncuran AI Agent pertama (Struk Belanja ke Excel)', 'Sistem FRSC, Rewards, dan otentikasi pengguna', 'Integrasi pipeline esktraksi dokumen end-to-end', 'Optimasi keamanan penyimpanan file (privacy-first)'] },
      { phase: 'Q3 2026', title: 'AI Agent Kedua & Komunitas', items: ['Peluncuran AI Agent kedua (Image to Invoice)', 'Perluasan AI Blog dan konten edukasi', 'Sistem kampanye promosi berbasis AI agent', 'Peningkatan akurasi ekstraksi dan validasi angka'] },
      { phase: 'Q4 2026', title: 'Skalabilitas & Pemberdayaan Lokal', items: ['Peningkatan infrastruktur dan skalabilitas agent', 'Pemberdayaan bisnis lokal melalui AI agents', 'Ekspansi fitur partnership dan komunitas', 'Optimasi untuk aksesibilitas pengguna Indonesia'] },
    ],
    valuesTitle: 'Nilai-Nilai Kami',
    values: [
      { icon: Eye, title: 'Transparan', desc: 'Kami terbuka tentang cara kerja, kebijakan, dan pengambilan keputusan.' },
      { icon: Heart, title: 'Inklusif', desc: 'Semua orang diterima. Platform kami dirancang untuk keberagaman pengguna.' },
      { icon: Shield, title: 'Berintegritas', desc: 'Kami mengutamakan keamanan data, privasi, dan etika dalam setiap aspek.' },
    ],
    contactTitle: 'Hubungi Kami',
    contactText: 'Punya pertanyaan, saran, atau ingin berkolaborasi? Kami senang mendengar dari Anda.',
    contactEmail: 'hello@farisium.com',
    disclaimerTitle: 'Informasi Penting',
    disclaimerText: 'Farisium adalah platform AI yang menyediakan alat kreatif berbasis kecerdasan buatan. Seluruh layanan disediakan "apa adanya" (as-is) dan ditujukan untuk keperluan kreatif dan edukasi. Farisium tidak menyediakan layanan investasi, keuangan, atau konsultasi profesional.',
  },
  en: {
    badge: 'About Us',
    heading: 'Meet Farisium',
    description: 'Farisium is an Agentic AI platform designing artificial intelligence to actually work — reading documents, extracting data, validating numbers, and completing real work automatically.',
    apaTitle: 'What is Farisium?',
    apaText: 'Farisium is an Agentic AI platform built by M. Faris Deni K. designed to change how you work. Instead of yet another chatbot or image generator, Farisium delivers AI agents that operate like professional assistants: reading a shopping receipt and turning it into a valid Excel file, converting an invoice photo into a ready-to-use digital invoice, and running music promotion campaigns autonomously.\n\nWe believe the future of AI is not just answering questions — AI must complete the work. Farisium is built to close the gap between artificial intelligence and real business operations, with a simple interface, affordable costs, and an ecosystem that keeps growing.',
    founderTitle: 'Behind Farisium',
    founderName: 'M. Faris Deni K.',
    founderRole: 'Agentic AI Leader',
    founderText: 'Farisium is led by M. Faris Deni K., an Agentic AI Leader who designs and builds autonomous AI platforms for smarter workflows — turning business operations into scalable, AI-powered efficiency. With a background in web development and AI architecture, Faris builds AI agents that actually do real work: reading documents, extracting data, validating results, and producing ready-to-use output.',
    visiTitle: 'Vision',
    visiText: 'To become the leading AI platform that empowers creators and businesses in Indonesia and Southeast Asia through accessible, affordable, and beneficial artificial intelligence technology.',
    misiTitle: 'Mission',
    misiItems: [
      { icon: Target, title: 'AI for Everyone', desc: 'Making AI technology easily accessible to anyone, without requiring a technical background.' },
      { icon: Heart, title: 'Creator Economy', desc: 'Building an ecosystem where creators can derive value from their contributions.' },
      { icon: Shield, title: 'Responsible Technology', desc: 'Developing AI that is ethical, transparent, and beneficial to society.' },
      { icon: Rocket, title: 'Continuous Innovation', desc: 'Continuously delivering new features and tools that are relevant to user needs.' },
    ],
    ecosystemTitle: 'Digital Creative Ecosystem',
    ecosystemText: 'Farisium is more than just a collection of AI tools — we are building an interconnected agentic AI ecosystem. Every agent is designed to complete one real job with output you can use immediately: from receipt extraction, invoice creation, to music promotion campaigns. All integrated into a single platform with an FRSC-based reward system and a growing community.',
    toolsTitle: 'Agentic AI',
    toolsText: 'Farisium\'s AI agents are built to work, not just to chat. Our first agent turns a shopping receipt photo into a clean, validated Excel file; our second agent turns an invoice photo into a professional digital invoice with PDF and Excel; and more are on the way. Every agent is designed to be simple, accurate, and output-ready. Visit the [[Agentic AI](/ai)] page for the full list.',
    frscTitle: 'FRSC (Farisium Coin)',
    frscText: 'FRSC is Farisium\'s internal utility token used to access premium services across the platform. Whether it is receipt conversion, digital invoice creation, or music promotion campaigns — FRSC lets every user enjoy premium AI services fairly and sustainably. Earn free FRSC through the daily Rewards system and various competition events.',
    rewardsTitle: 'Rewards',
    rewardsText: 'The Farisium Rewards system gives every user the opportunity to earn free FRSC daily. Simply visit the Rewards page, claim your daily bonus, and use FRSC to access various premium AI features. We believe that with a fair reward system, more people can experience the benefits of AI without cost barriers. Start claiming at the [[Rewards](/rewards)] page.',
    partnershipTitle: 'Partnership',
    partnershipText: 'Farisium opens partnership opportunities for creators, developers, educational institutions, and businesses looking to collaborate. The partnership program covers technology integration, content collaboration, joint research, and various other strategic partnerships. Interested in becoming a partner? Visit the [[Partnership](/partnership)] page for more information.',
    roadmapTitle: 'Roadmap',
    roadmapQuarter: 'Quarter',
    roadmapPhases: [
      { phase: 'Q1 2026', title: 'Foundation & Early Research', items: ['Platform architecture research and planning', 'Core product and design development', 'Alpha website launch', 'Internal testing and bug fixing'] },
      { phase: 'Q2 2026', title: 'First Agentic AI & Ecosystem', items: ['Launch of first AI Agent (Receipt to Excel)', 'FRSC, Rewards, and user authentication systems', 'End-to-end document extraction pipeline', 'Privacy-first file storage optimization'] },
      { phase: 'Q3 2026', title: 'Second AI Agent & Community', items: ['Launch of second AI Agent (Image to Invoice)', 'AI Blog expansion and educational content', 'AI agent-driven promotion campaign system', 'Extraction and number validation accuracy upgrades'] },
      { phase: 'Q4 2026', title: 'Scalability & Local Empowerment', items: ['Agent infrastructure and scalability improvements', 'Local business empowerment through AI agents', 'Partnership and community feature expansion', 'Optimization for Indonesian user accessibility'] },
    ],
    valuesTitle: 'Our Values',
    values: [
      { icon: Eye, title: 'Transparent', desc: 'We are open about how we work, our policies, and decision-making.' },
      { icon: Heart, title: 'Inclusive', desc: 'Everyone is welcome. Our platform is designed for diverse users.' },
      { icon: Shield, title: 'Integrity', desc: 'We prioritize data security, privacy, and ethics in every aspect.' },
    ],
    contactTitle: 'Contact Us',
    contactText: 'Have questions, suggestions, or want to collaborate? We would love to hear from you.',
    contactEmail: 'hello@farisium.com',
    disclaimerTitle: 'Important Information',
    disclaimerText: 'Farisium is an AI platform providing creative artificial intelligence-powered tools. All services are provided "as-is" and are intended for creative and educational purposes. Farisium does not provide investment, financial, or professional consulting services.',
  },
}

function FounderCard({ name, role, bio, lang }: { name: string; role: string; bio: string; lang: Lang }) {
  return (
    <div className={`reveal-on-scroll reveal-stagger reveal-delay-1 flex flex-col items-center gap-6 rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 shadow-metallic sm:flex-row sm:items-start`}>
      <div className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/faris.webp"
          alt={name}
          width={120}
          height={120}
          className="h-28 w-28 rounded-2xl border-2 border-frsc-crimson-500/30 object-cover shadow-lg"
        />
      </div>
      <div className="text-center sm:text-left">
        <h3 className="font-heading text-lg font-bold text-foreground">{name}</h3>
        <p className="text-sm font-medium text-frsc-crimson-400">{role}</p>
        <p className="mt-3 text-sm leading-relaxed text-frsc-text-200">{bio}</p>
      </div>
    </div>
  )
}

export default async function AboutPage() {
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
            <Info className="h-3 w-3" aria-hidden="true" />
            {content.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {content.heading}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-lead text-frsc-text-200">
            {content.description}
          </p>
        </section>

        {/* Apa itu Farisium? */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 shadow-metallic">
            <h2 className="heading-fluid text-h3 mb-4 text-foreground">{content.apaTitle}</h2>
            {content.apaText.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-pretty text-sm text-frsc-text-200 leading-relaxed mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.founderTitle}</h2>
          <FounderCard name={content.founderName} role={content.founderRole} bio={content.founderText} lang={lang} />
        </section>

        {/* Visi */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 shadow-metallic">
            <h2 className="heading-fluid text-h3 mb-4 text-foreground">{content.visiTitle}</h2>
            <p className="text-pretty text-sm text-frsc-text-200 leading-relaxed">{content.visiText}</p>
          </div>
        </section>

        {/* Misi */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.misiTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.misiItems.map(({ icon: Icon, title, desc }, i) => (
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

        {/* Digital Creative Ecosystem */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 shadow-metallic">
            <h2 className="heading-fluid text-h3 mb-4 text-foreground">{content.ecosystemTitle}</h2>
            <p className="text-pretty text-sm text-frsc-text-200 leading-relaxed">{content.ecosystemText}</p>
          </div>
        </section>

        {/* AI Tools, FRSC, Rewards, Partnership */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="reveal-on-scroll reveal-stagger reveal-delay-1 flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                <Brain className="h-5 w-5 text-frsc-crimson-400" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.toolsTitle}</h3>
                <p className="mt-1 text-sm text-frsc-text-200"><RenderMarkdownLinks text={content.toolsText} /></p>
              </div>
            </div>
            <div className="reveal-on-scroll reveal-stagger reveal-delay-2 flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                <Coins className="h-5 w-5 text-frsc-crimson-400" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.frscTitle}</h3>
                <p className="mt-1 text-sm text-frsc-text-200">{content.frscText}</p>
              </div>
            </div>
            <div className="reveal-on-scroll reveal-stagger reveal-delay-3 flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                <Gift className="h-5 w-5 text-frsc-crimson-400" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.rewardsTitle}</h3>
                <p className="mt-1 text-sm text-frsc-text-200"><RenderMarkdownLinks text={content.rewardsText} /></p>
              </div>
            </div>
            <div className="reveal-on-scroll reveal-stagger reveal-delay-4 flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 shadow-sm">
                <Handshake className="h-5 w-5 text-frsc-crimson-400" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.partnershipTitle}</h3>
                <p className="mt-1 text-sm text-frsc-text-200"><RenderMarkdownLinks text={content.partnershipText} /></p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-8 text-foreground">{content.roadmapTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.roadmapPhases.map((phase, i) => (
              <div key={phase.phase} className={`reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic`}>
                <div className="mb-3 flex items-center gap-2">
                  <Map className="h-4 w-4 text-frsc-crimson-400" />
                  <span className="font-heading text-xs font-semibold uppercase tracking-wider text-frsc-crimson-400">{phase.phase}</span>
                </div>
                <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{phase.title}</h3>
                <ul className="mt-3 space-y-1.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-frsc-text-200">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-frsc-crimson-500/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-6 text-foreground">{content.valuesTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.values.map(({ icon: Icon, title, desc }, i) => (
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

        {/* Contact */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-6">
          <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-6 shadow-metallic">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-frsc-crimson-400" aria-hidden="true" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.contactTitle}</h3>
              <p className="mt-1 text-sm text-frsc-text-200">{content.contactText}</p>
              <a href={`mailto:${content.contactEmail}`} className="mt-2 inline-flex text-sm font-medium text-frsc-crimson-400 hover:text-frsc-crimson-300 transition-colors">
                {content.contactEmail}
              </a>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 lg:px-6">
          <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-frsc-surface-900 p-6 shadow-metallic">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-frsc-crimson-400" aria-hidden="true" />
            <div>
              <h3 className="font-heading text-sm font-semibold text-frsc-white-bright">{content.disclaimerTitle}</h3>
              <p className="mt-1 text-sm text-frsc-text-200">{content.disclaimerText}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
