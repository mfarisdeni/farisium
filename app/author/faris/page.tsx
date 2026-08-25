import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Globe, Mail, ExternalLink, PenLine, Sparkles, Quote } from 'lucide-react'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const titles = { id: 'M. Faris Deni K. — Founder Farisium', en: 'M. Faris Deni K. — Founder of Farisium' }
  const descriptions = {
    id: 'M. Faris Deni K. adalah Founder & Pengembang Farisium. Pelajari lebih lanjut tentang visi, misi, dan perjalanan membangun platform AI all-in-one.',
    en: 'M. Faris Deni K. is the Founder & Developer of Farisium. Learn more about the vision, mission, and journey of building an all-in-one AI platform.',
  }
  const canonicalUrl = getCanonicalUrl(lang, '/author/faris')
  const alternates = getHreflangLinks('/author/faris', lang)
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
      type: 'profile',
      images: [
        { url: '/faris.webp', width: 400, height: 400, alt: 'M. Faris Deni K.' },
        { url: '/og-image.png', width: 1200, height: 630, alt: 'M. Faris Deni K. — Farisium' },
      ],
      firstName: 'M. Faris',
      lastName: 'Deni K.',
      username: 'faris',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/faris.webp'],
    },
    robots: { index: true, follow: true },
    keywords: [
      'M. Faris Deni K.',
      'Founder Farisium',
      'pengembang AI',
      'AI developer Indonesia',
      'Farisium founder',
      'pembuat Farisium',
      'teknologi AI Indonesia',
    ],
  }
}

const posts = {
  id: [
    { slug: 'cara-menulis-prompt-anime-ai', title: 'Prompt Engineering untuk AI Anime: Cara Membuat Prompt yang Sempurna' },
    { slug: 'ai-untuk-content-creator', title: 'AI untuk Content Creator: Tools yang Wajib Dicoba di 2026' },
    { slug: 'perbandingan-ai-image-generator-terbaik-2026', title: '5 AI Image Generator Terbaik 2026: Perbandingan Lengkap' },
    { slug: 'cara-menggunakan-ai-untuk-produktivitas-kerja', title: 'Cara Menggunakan AI untuk Meningkatkan Produktivitas Kerja 2026' },
    { slug: 'cara-mendapatkan-frsc-gratis-farisium', title: 'Cara Mendapatkan FRSC Gratis dan Menggunakannya di Farisium' },
    { slug: 'ai-untuk-marketing-konten-2026', title: 'AI untuk Marketing Konten: Strategi dan Tools 2026' },
    { slug: 'kursus-ai-online-terbaik-2026', title: 'Kursus AI Online Terbaik 2026: Dari Pemula hingga Mahir' },
    { slug: 'ai-untuk-ukm-2026', title: 'AI untuk Bisnis Kecil dan UKM: Tools dan Strategi 2026' },
    { slug: 'ai-untuk-desain-grafis-2026', title: 'AI untuk Desain Grafis: Tools dan Tips Terbaik 2026' },
    { slug: 'masa-depan-ai-indonesia-2026', title: 'Masa Depan AI di Indonesia: Peluang dan Tantangan 2026' },
    { slug: 'tips-memulai-karir-ai', title: 'Tips Memulai Karir AI: Panduan Lengkap untuk Pemula 2026' },
    { slug: 'panduan-ai-generatif-pemula', title: 'Panduan AI Generatif untuk Pemula: Cara Kerja dan Tools 2026' },
    { slug: 'ai-untuk-bisnis-ecommerce-2026', title: 'AI untuk Bisnis E-commerce: Strategi dan Tools 2026' },
    { slug: 'ai-dalam-pendidikan-2026', title: 'AI dalam Pendidikan: Revolusi Cara Belajar 2026' },
    { slug: 'panduan-memulai-machine-learning', title: 'Panduan Memulai Machine Learning untuk Pemula 2026' },
  ],
  en: [
    { slug: 'how-to-write-ai-anime-prompts', title: 'Prompt Engineering for AI Anime: How to Craft the Perfect Prompt' },
    { slug: 'ai-for-content-creators', title: 'AI for Content Creators: Essential Tools to Try in 2026' },
    { slug: 'best-ai-image-generators-comparison-2026', title: '5 Best AI Image Generators in 2026: Complete Comparison' },
    { slug: 'how-to-use-ai-for-work-productivity-2026', title: 'How to Use AI to Boost Work Productivity in 2026' },
    { slug: 'how-to-get-free-frsc-farisium', title: 'How to Get Free FRSC and Use It on Farisium' },
    { slug: 'ai-for-content-marketing-2026', title: 'AI for Content Marketing: Strategies and Tools 2026' },
    { slug: 'best-online-ai-courses-2026', title: 'Best Online AI Courses 2026: From Beginner to Advanced' },
    { slug: 'ai-for-small-business-2026', title: 'AI for Small Businesses and SMEs: Tools and Strategies 2026' },
    { slug: 'ai-for-graphic-design-2026', title: 'AI for Graphic Design: Best Tools and Tips 2026' },
    { slug: 'future-of-ai-indonesia-2026', title: 'Future of AI in Indonesia: Opportunities and Challenges 2026' },
    { slug: 'tips-starting-ai-career', title: 'Tips for Starting an AI Career: Complete Guide for Beginners 2026' },
    { slug: 'generative-ai-guide-beginners', title: 'Generative AI Guide for Beginners: How It Works and Tools 2026' },
    { slug: 'ai-for-ecommerce-business-2026', title: 'AI for E-commerce Business: Strategies and Tools 2026' },
    { slug: 'ai-in-education-2026', title: 'AI in Education: The Learning Revolution 2026' },
    { slug: 'machine-learning-guide-beginners', title: 'Machine Learning Guide for Beginners 2026' },
  ],
}

export default async function AuthorPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang

  const content = {
    id: {
      title: 'Tentang Penulis',
      role: 'Founder & Pengembang Farisium',
      bio: [
        'M. Faris Deni K. adalah pendiri dan pengembang utama Farisium — platform AI all-in-one yang menyediakan berbagai alat kecerdasan buatan untuk kreator, pebisnis, dan pengguna umum di Indonesia.',
        'Dengan latar belakang di bidang pengembangan perangkat lunak dan kecerdasan buatan, Faris membangun Farisium dengan visi untuk membuat teknologi AI lebih mudah diakses oleh semua orang, tanpa memandang latar belakang teknis.',
        'Faris percaya bahwa AI memiliki potensi luar biasa untuk meningkatkan produktivitas, kreativitas, dan kualitas hidup. Melalui Farisium, ia berkomitmen untuk menghadirkan solusi AI yang premium, mudah digunakan, dan bermanfaat bagi masyarakat Indonesia.',
      ],
      writing: 'Menulis tentang AI, teknologi, dan pengembangan platform di Blog Farisium.',
      quote: 'Saya percaya bahwa teknologi terbaik adalah yang bisa digunakan oleh siapa saja, kapan saja, dan di mana saja — tanpa hambatan.',
      articles: 'Artikel Terbaru',
      readMore: 'Baca Artikel',
      social: 'Temukan Saya',
    },
    en: {
      title: 'About the Author',
      role: 'Founder & Developer of Farisium',
      bio: [
        'M. Faris Deni K. is the founder and lead developer of Farisium — an all-in-one AI platform providing various artificial intelligence tools for creators, business owners, and general users.',
        'With a background in software development and artificial intelligence, Faris built Farisium with the vision of making AI technology more accessible to everyone, regardless of technical background.',
        'Faris believes that AI has extraordinary potential to enhance productivity, creativity, and quality of life. Through Farisium, he is committed to delivering premium, easy-to-use AI solutions that benefit the Indonesian community.',
      ],
      writing: 'Writing about AI, technology, and platform development on the Farisium Blog.',
      quote: 'I believe the best technology is one that anyone can use, anytime, anywhere — without barriers.',
      articles: 'Latest Articles',
      readMore: 'Read Articles',
      social: 'Find Me',
    },
  }

  const c = content[lang]
  const articleList = posts[lang]
  const latestArticles = articleList.slice(0, 6)

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Ambient glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-frsc-crimson-500/6 blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-frsc-purple-500/5 blur-3xl" />
          </div>

          {/* Author header */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start sm:gap-8">
            <div className="shrink-0">
              <div className="relative mx-auto h-28 w-28 sm:mx-0 sm:h-32 sm:w-32">
                <img
                  src="/faris.webp"
                  alt="M. Faris Deni K."
                  className="h-full w-full rounded-2xl border border-white/[0.08] object-cover shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-frsc-crimson-600 shadow-md">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-0 sm:min-w-0">
              <h1 className="heading-fluid text-hero text-frsc-white-bright font-heading text-2xl font-bold sm:text-3xl">
                M. Faris Deni K.
              </h1>
              <p className="mt-1.5 text-sm text-frsc-crimson-400">{c.role}</p>
              <p className="mt-1 text-xs text-frsc-text-300">{c.writing}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-10 space-y-4">
            {c.bio.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-frsc-text-200">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Quote */}
          <div className="relative mt-10 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-6">
            <Quote className="absolute -left-2 -top-2 h-8 w-8 text-frsc-crimson-500/20" aria-hidden="true" />
            <blockquote className="text-sm italic leading-relaxed text-frsc-text-200">
              &ldquo;{c.quote}&rdquo;
            </blockquote>
          </div>

          {/* Social links */}
          <div className="mt-10">
            <h2 className="mb-4 text-sm font-semibold text-frsc-white-bright">{c.social}</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:hi@farisium.com"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-frsc-text-200 transition-colors hover:border-frsc-crimson-500/25 hover:bg-frsc-crimson-800/10 hover:text-frsc-crimson-300"
              >
                <Mail className="h-4 w-4" />
                hi@farisium.com
              </a>
              <a
                href="https://farisium.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-frsc-text-200 transition-colors hover:border-frsc-crimson-500/25 hover:bg-frsc-crimson-800/10 hover:text-frsc-crimson-300"
              >
                <Globe className="h-4 w-4" />
                Farisium
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Latest articles */}
          <div className="mt-14">
            <h2 className="mb-5 text-sm font-semibold text-frsc-white-bright">{c.articles}</h2>
            <div className="space-y-2">
              {latestArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-frsc-text-200 transition-all hover:border-white/[0.06] hover:bg-white/[0.02] hover:text-frsc-white-bright"
                >
                  <PenLine className="h-3.5 w-3.5 shrink-0 text-frsc-text-300/50 transition-colors group-hover:text-frsc-crimson-400" />
                  <span className="line-clamp-1">{article.title}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-frsc-crimson-400 transition-colors hover:text-frsc-crimson-300"
              >
                {c.readMore}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  )
}
