import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { AIToolsSection } from '@/components/home/AIToolsSection'
import { ComputeSection } from '@/components/home/ComputeSection'
import { WhyFarisiumSection } from '@/components/home/WhyFarisiumSection'
import { BlogSection } from '@/components/home/BlogSection'
import { PartnershipSection } from '@/components/home/PartnershipSection'
import { FAQSection } from '@/components/home/FAQSection'
import { DiscordSection } from '@/components/ui/DiscordSection'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { ScrollReveal } from '@/components/scroll-reveal'
import { detectLocale, COOKIE_NAME, getCanonicalUrl, getHreflangLinks } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  const path = '/farisium'

  const titles = {
    id: 'Farisium — Platform AI All-in-One untuk Kreator & Bisnis',
    en: 'Farisium — All-in-One AI Platform for Creators & Businesses',
  }
  const descriptions = {
    id: 'Jelajahi Farisium, platform AI all-in-one dengan AI tools, generator gambar anime, rewards, partnership, blog, dan solusi digital untuk kreator dan bisnis.',
    en: 'Explore Farisium, an all-in-one AI platform featuring AI tools, anime image generation, rewards, partnerships, blogs, and digital solutions for creators and businesses.',
  }
  const keywords = [
    'AI tools',
    'anime generator',
    'AI image generation',
    'AI platform',
    'artificial intelligence',
    'anime AI',
    'text to image',
    'AI art generator',
    'digital ecosystem',
    'Farisium',
    'generator anime',
    'platform AI',
    'solusi digital',
  ]
  const canonicalUrl = getCanonicalUrl(lang, path)
  const alternates = getHreflangLinks(path, lang)
  return {
    title: {
      default: titles[lang],
      template: '%s | Farisium',
    },
    description: descriptions[lang],
    keywords,
    authors: [{ name: 'Farisium' }],
    creator: 'Farisium',
    publisher: 'Farisium',
    metadataBase: new URL('https://farisium.com'),
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(alternates.map((a) => [a.lang, a.href])),
    },
    openGraph: {
      type: 'website',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      url: canonicalUrl,
      siteName: 'Farisium',
      title: titles[lang],
      description: descriptions[lang],
      images: [
        { url: '/og-image.png', width: 1200, height: 630, alt: 'Farisium' },
        { url: '/icon-light-32x32.png', width: 32, height: 32, alt: 'Farisium' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang],
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Apa itu Farisium?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Farisium adalah platform AI terpadu yang menyediakan berbagai layanan berbasis Artificial Intelligence dalam satu ekosistem. Dimulai dari Anime Generator, platform ini akan terus berkembang dengan AI Tools baru.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apa itu FRSC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FRSC (Farisium Coin) adalah utility point resmi ekosistem Farisium. FRSC digunakan untuk mengakses layanan AI, klaim reward, dan berpartisipasi dalam ekosistem. FRSC bukan mata uang dan bukan instrumen investasi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Bagaimana cara mendapatkan FRSC secara gratis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kamu bisa mendapatkan FRSC melalui Starter Coin saat pertama kali mendaftar, Daily Reward setiap 24 jam, program Referral, Loyalty Reward berdasarkan aktivitas, dan event resmi Farisium.',
      },
    },
    {
      '@type': 'Question',
      name: 'Apakah Anime Generator aman digunakan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ya. AI inference berjalan di infrastruktur self-hosted Farisium. Data dan gambar yang kamu hasilkan tidak dibagikan kepada pihak ketiga untuk tujuan pemasaran.',
      },
    },
    {
      '@type': 'Question',
      name: 'AI Tools apa saja yang akan hadir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Roadmap Farisium mencakup Product Photo, Logo Generator, Subtitle Generator, Blog Writer, dan Influencer Generator. Semua akan tersedia di bawah domain farisium.com/ai.',
      },
    },
  ],
}

export default async function FarisiumLandingPage() {
  const cookieStore = await cookies()
  const lang = detectLocale(cookieStore.get(COOKIE_NAME)?.value) as Lang
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection lang={lang} />
        <AIToolsSection lang={lang} />
        <ComputeSection lang={lang} />
        <WhyFarisiumSection lang={lang} />
        <BlogSection lang={lang} />
        <PartnershipSection lang={lang} />
        <FAQSection lang={lang} />
        <DiscordSection lang={lang} />
        <SocialLinks showDiscord={false} />
      </main>
      <Footer />
      <ScrollReveal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}
