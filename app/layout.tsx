import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import Script from 'next/script'
import { Geist, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { FRSCProvider } from '@/contexts/FRSCContext'
import { PageLoader } from '@/components/page-loader'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'
import { detectLocale, COOKIE_NAME, getCanonicalUrl } from '@/lib/i18n'
import type { Lang } from '@/lib/translations'

const GA_MEASUREMENT_ID = 'G-XJDXLEEYDZ'

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const geistSans = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = detectLocale(
    cookieStore.get(COOKIE_NAME)?.value,
  ) as Lang

  const title = 'Farisium — AI Tools, Creative Platform & Digital Ecosystem'

  const descriptions = {
    id: 'Temukan Farisium, platform AI all-in-one dengan AI tools, generator gambar anime, rewards, partnership, blog, dan solusi digital untuk kreator dan bisnis.',
    en: 'Discover Farisium, an all-in-one AI platform featuring AI tools, anime image generation, rewards, partnerships, blogs, and digital solutions for creators and businesses.',
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

  return {
    title: {
      default: title,
      template: '%s | Farisium',
    },
    description: descriptions[lang],
    keywords,
    authors: [{ name: 'Farisium' }],
    creator: 'Farisium',
    publisher: 'Farisium',
    metadataBase: new URL('https://farisium.com'),
    alternates: {
      canonical: getCanonicalUrl(lang, '/'),
      languages: {
        'x-default': getCanonicalUrl('en', '/'),
        'id': getCanonicalUrl('id', '/'),
        'en': getCanonicalUrl('en', '/'),
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'id' ? 'id_ID' : 'en_US',
      url: getCanonicalUrl(lang, '/'),
      siteName: 'Farisium',
      title,
      description: descriptions[lang],
      images: [
        { url: '/og-image.png', width: 1200, height: 630, alt: 'Farisium — AI Tools, Creative Platform & Digital Ecosystem' },
        { url: '/icon-light-32x32.png', width: 32, height: 32, alt: 'Farisium' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: descriptions[lang],
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    icons: {
      icon: '/icon.svg',
      apple: '/apple-icon.png',
      other: [{ rel: 'icon', url: '/icon-light-32x32.png', sizes: '32x32' }],
    },
    manifest: '/manifest.webmanifest',
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0a',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Farisium',
  url: 'https://farisium.com',
  logo: 'https://farisium.com/apple-icon.png',
  description:
    'Platform AI all-in-one dengan AI tools, generator gambar anime, rewards, partnership, blog, dan solusi digital untuk kreator dan bisnis.',
  foundingDate: '2025',
  sameAs: [
    'https://discord.gg/SCDFEbRpjm',
    'https://www.linkedin.com/company/farisium/',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Farisium',
  url: 'https://farisium.com',
  description:
    'Platform AI all-in-one dengan AI tools, generator gambar anime, rewards, partnership, blog, dan solusi digital untuk kreator dan bisnis.',
  inLanguage: 'id',
  applicationCategory: 'AIApplication',
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Farisium',
  url: 'https://farisium.com',
  description:
    'Platform AI all-in-one dengan AI tools, generator gambar anime, rewards, partnership, blog, dan solusi digital untuk kreator dan bisnis.',
  applicationCategory: 'AIApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'M. Faris Deni K.',
    url: 'https://farisium.com/author/faris',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'M. Faris Deni K.',
  url: 'https://farisium.com/author/faris',
  image: 'https://farisium.com/faris.webp',
  jobTitle: 'Founder & CEO',
  worksFor: {
    '@type': 'Organization',
    name: 'Farisium',
  },
  sameAs: [
    'https://discord.gg/SCDFEbRpjm',
    'https://www.linkedin.com/company/farisium/',
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Farisium — Platform AI All-in-One untuk Kreator dan Bisnis',
  description:
    'Platform AI all-in-one dengan AI tools, generator gambar anime, rewards, partnership, blog, dan solusi digital untuk kreator dan bisnis.',
  author: {
    '@type': 'Person',
    name: 'M. Faris Deni K.',
    url: 'https://farisium.com/author/faris',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Farisium',
    url: 'https://farisium.com',
  },
  image: 'https://farisium.com/og-image.png',
  datePublished: '2025-01-01T00:00:00.000Z',
  dateModified: new Date().toISOString(),
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const skipLabels = {
    id: 'Langsung ke konten utama',
    en: 'Skip to main content',
  }

  const cookieStore = await cookies()
  const lang = detectLocale(
    cookieStore.get(COOKIE_NAME)?.value,
  ) as Lang

  return (
    <html
      lang={lang}
      className={`dark bg-background ${plusJakarta.variable} ${jetbrainsMono.variable} ${geistSans.variable}`}
    >
      <head>
        <meta name="google-site-verification" content="LccxfAvkR8ZLqLkOotjF3D48nkhxoRczCcEdFwXWJBM" />
        <link rel="llms-txt" href="https://farisium.com/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      </head>
      <body className="bg-background font-sans antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-xl focus:bg-frsc-crimson-800 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          {skipLabels[lang]}
        </a>
        <Providers initialLang={lang}>
          <PageLoader>
            <AuthProvider>
              <FRSCProvider>
                <div id="main-content" tabIndex={-1}>
                  {children}
                </div>
              </FRSCProvider>
            </AuthProvider>
          </PageLoader>
        </Providers>

        <Toaster position="bottom-center" />
        <Analytics />
      </body>
    </html>
  )
}
