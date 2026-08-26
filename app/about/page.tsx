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
    id: 'Pelajari lebih lanjut tentang Farisium, platform AI all-in-one yang menyediakan AI tools, anime generator, rewards, dan ekosistem digital untuk kreator dan bisnis.',
    en: 'Learn more about Farisium, an all-in-one AI platform providing AI tools, anime generator, rewards, and a digital ecosystem for creators and businesses.',
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
    description: 'Farisium adalah platform AI terpadu yang menyediakan berbagai alat berbasis kecerdasan buatan untuk membantu kreator, developer, dan bisnis mengembangkan potensi mereka.',
    apaTitle: 'Apa itu Farisium?',
    apaText: 'Farisium adalah platform AI all-in-one yang dirancang untuk memberdayakan kreator, developer, dan bisnis di Indonesia. Dimulai dengan Anime Generator sebagai produk pertama, Farisium berkembang menjadi ekosistem digital yang menyatukan berbagai alat AI, sistem reward berbasis token FRSC, dan komunitas kreatif.\n\nKami percaya bahwa kecerdasan buatan bukanlah masa depan yang jauh — AI adalah alat yang harus bisa diakses oleh semua orang hari ini. Farisium hadir untuk menjembatani kesenjangan akses terhadap teknologi AI canggih dengan antarmuka yang sederhana, biaya yang terjangkau, dan ekosistem yang mendukung.',
    founderTitle: 'Di Balik Farisium',
    founderName: 'M. Faris Deni K.',
    founderRole: 'Founder & CEO',
    founderText: 'Farisium dikembangkan oleh M. Faris Deni K., seorang pengembang dan kreator asal Indonesia yang percaya bahwa AI harus dapat diakses oleh semua kalangan. Dengan latar belakang di bidang pengembangan web dan teknologi AI, Faris membangun Farisium sebagai wujud nyata dari visinya: mendemokratisasi akses AI untuk masyarakat Indonesia dan dunia.',
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
    ecosystemText: 'Farisium bukan sekadar kumpulan tools AI — kami membangun ekosistem digital kreatif yang saling terhubung. Setiap elemen dalam Farisium dirancang untuk mendukung satu sama lain, menciptakan pengalaman yang seamless bagi pengguna. Dari alat AI canggih, sistem reward berbasis FRSC, hingga komunitas kreatif — semuanya terintegrasi dalam satu platform.',
    toolsTitle: 'AI Tools',
    toolsText: 'Produk pertama Farisium adalah Anime Generator, sebuah alat AI image generation yang dioptimalkan khusus untuk gaya anime dan ilustrasi digital. Ke depannya, Farisium akan terus menghadirkan AI tools baru seperti AI Chat, AI Voice Generator, dan berbagai alat produktivitas lainnya. Setiap tools dirancang dengan prinsip sederhana, powerful, dan dapat diakses oleh semua kalangan. Kunjungi halaman [[AI Tools](/ai)] untuk melihat daftar lengkap.',
    frscTitle: 'FRSC (Farisium Coin)',
    frscText: 'FRSC adalah token utilitas internal Farisium yang digunakan untuk mengakses layanan premium di seluruh platform. Setiap generasi gambar di Anime Generator membutuhkan 1 FRSC. Pengguna bisa mendapatkan FRSC gratis melalui sistem Rewards harian dan berbagai event kompetisi. FRSC memungkinkan semua pengguna menikmati layanan AI premium secara adil dan berkelanjutan.',
    rewardsTitle: 'Rewards',
    rewardsText: 'Sistem Rewards Farisium memberikan kesempatan kepada setiap pengguna untuk mendapatkan FRSC gratis setiap hari. Cukup kunjungi halaman Rewards, klaim bonus harian Anda, dan gunakan FRSC untuk mengakses berbagai fitur AI premium. Kami percaya bahwa dengan sistem reward yang adil, lebih banyak orang bisa merasakan manfaat AI tanpa hambatan biaya. Mulai klaim di halaman [[Rewards](/rewards)].',
    partnershipTitle: 'Partnership',
    partnershipText: 'Farisium membuka peluang partnership bagi kreator, pengembang, institusi pendidikan, dan bisnis yang ingin berkolaborasi. Program partnership mencakup integrasi teknologi, kolaborasi konten, riset bersama, dan berbagai bentuk kemitraan strategis lainnya. Tertarik menjadi mitra? Kunjungi halaman [[Partnership](/partnership)] untuk informasi lebih lanjut.',
    roadmapTitle: 'Roadmap',
    roadmapQuarter: 'Kuarter',
    roadmapPhases: [
      { phase: 'Q1 2026', title: 'Pre-Development & Fase Awal', items: ['Riset dan perencanaan platform', 'Pengembangan Anime Generator', 'Peluncuran versi alpha website', 'Uji coba internal dan bug fixing'] },
      { phase: 'Q2 2026', title: 'AI Tool Kedua & FRSC Partnership', items: ['Peluncuran AI tool kedua (AI Chat)', 'FRSC Partnership dengan kreator dan komunitas', 'Peningkatan fitur Rewards', 'Optimasi performa Anime Generator'] },
      { phase: 'Q3 2026', title: 'Tech News & AI Tool Ketiga', items: ['Peluncuran fitur Tech News / Blog', 'Pengembangan AI tool ketiga (AI Voice / Image Tools)', 'Peningkatan infrastruktur AI Compute', 'Ekspansi konten dan jangkauan pengguna'] },
      { phase: 'Q4 2026', title: 'Usability Massal & Pemberdayaan Lokal', items: ['Peningkatan UX/UI secara menyeluruh', 'Pemberdayaan bisnis lokal melalui AI', 'Ekspansi fitur partnership dan komunitas', 'Optimasi untuk aksesibilitas pengguna Indonesia'] },
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
    description: 'Farisium is an integrated AI platform providing various artificial intelligence-powered tools to help creators, developers, and businesses unlock their potential.',
    apaTitle: 'What is Farisium?',
    apaText: 'Farisium is an all-in-one AI platform designed to empower creators, developers, and businesses in Indonesia. Starting with the Anime Generator as its first product, Farisium has grown into a digital ecosystem that unites various AI tools, a token-based reward system (FRSC), and a creative community.\n\nWe believe artificial intelligence is not a distant future — AI is a tool that must be accessible to everyone today. Farisium bridges the gap to advanced AI technology with a simple interface, affordable costs, and a supportive ecosystem.',
    founderTitle: 'Behind Farisium',
    founderName: 'M. Faris Deni K.',
    founderRole: 'Founder & CEO',
    founderText: 'Farisium was built by M. Faris Deni K., a developer and creator from Indonesia who believes AI should be accessible to everyone. With a background in web development and AI technology, Faris built Farisium as a tangible realization of his vision: democratizing AI access for the people of Indonesia and the world.',
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
    ecosystemText: 'Farisium is more than just a collection of AI tools — we are building an interconnected digital creative ecosystem. Every element within Farisium is designed to support one another, creating a seamless experience for users. From advanced AI tools, the FRSC-based reward system, to the creative community — everything is integrated into a single platform.',
    toolsTitle: 'AI Tools',
    toolsText: 'Farisium\'s first product is the Anime Generator, an AI image generation tool optimized specifically for anime style and digital illustration. Going forward, Farisium will continue to introduce new AI tools such as AI Chat, AI Voice Generator, and various productivity tools. Every tool is designed with the principle of being simple, powerful, and accessible to all. Visit the [[AI Tools](/ai)] page for the complete list.',
    frscTitle: 'FRSC (Farisium Coin)',
    frscText: 'FRSC is Farisium\'s internal utility token used to access premium services across the platform. Each image generation in the Anime Generator requires 1 FRSC. Users can get free FRSC through the daily Rewards system and various competition events. FRSC enables all users to enjoy premium AI services fairly and sustainably.',
    rewardsTitle: 'Rewards',
    rewardsText: 'The Farisium Rewards system gives every user the opportunity to earn free FRSC daily. Simply visit the Rewards page, claim your daily bonus, and use FRSC to access various premium AI features. We believe that with a fair reward system, more people can experience the benefits of AI without cost barriers. Start claiming at the [[Rewards](/rewards)] page.',
    partnershipTitle: 'Partnership',
    partnershipText: 'Farisium opens partnership opportunities for creators, developers, educational institutions, and businesses looking to collaborate. The partnership program covers technology integration, content collaboration, joint research, and various other strategic partnerships. Interested in becoming a partner? Visit the [[Partnership](/partnership)] page for more information.',
    roadmapTitle: 'Roadmap',
    roadmapQuarter: 'Quarter',
    roadmapPhases: [
      { phase: 'Q1 2026', title: 'Pre-Development & Early Phase', items: ['Platform research and planning', 'Anime Generator development', 'Alpha website launch', 'Internal testing and bug fixing'] },
      { phase: 'Q2 2026', title: 'Second AI Tool & FRSC Partnership', items: ['Launch of second AI tool (AI Chat)', 'FRSC Partnership with creators and communities', 'Rewards feature enhancement', 'Anime Generator performance optimization'] },
      { phase: 'Q3 2026', title: 'Tech News & Third AI Tool', items: ['Tech News / Blog feature launch', 'Third AI tool development (AI Voice / Image Tools)', 'AI Compute infrastructure upgrade', 'Content and user reach expansion'] },
      { phase: 'Q4 2026', title: 'Mass Usability & Local Empowerment', items: ['Comprehensive UX/UI improvement', 'Local business empowerment through AI', 'Partnership and community feature expansion', 'Optimization for Indonesian user accessibility'] },
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
