import type { MetadataRoute } from 'next'
import { getAllPosts, parseDate } from '@/lib/blog'
import { locales, type Locale } from '@/lib/i18n'

const BASE_URL = 'https://farisium.com'

const staticPaths = [
  '',
  'ai',
  'ai/website-builder',
  'ai/f-stream-spotify-promotion',
  'rewards',
  'frsc',
  'blog',
  'partnership',
  'competition',
  'about',
  'contact',
  'community',
  'disclaimer',
  'claim-free-frsc',
  'author/faris',
  'faq',
  'cookie-policy',
  'privacy',
  'terms',
] as const

const staticPathPriorities: Record<string, number> = {
  '': 1.0,
  'ai': 0.9,
  'ai/website-builder': 0.8,
  'ai/f-stream-spotify-promotion': 0.8,
  'rewards': 0.8,
  'frsc': 0.7,
  'blog': 0.8,
  'partnership': 0.6,
  'competition': 0.6,
  'about': 0.5,
  'contact': 0.5,
  'community': 0.5,
  'disclaimer': 0.4,
  'claim-free-frsc': 0.5,
  'author/faris': 0.4,
  'faq': 0.5,
  'cookie-policy': 0.3,
  'privacy': 0.3,
  'terms': 0.3,
}

const staticPathChangeFreq: Record<string, 'daily' | 'weekly' | 'monthly'> = {
  '': 'weekly',
  'ai': 'weekly',
  'ai/website-builder': 'weekly',
  'ai/f-stream-spotify-promotion': 'weekly',
  'rewards': 'daily',
  'frsc': 'monthly',
  'blog': 'daily',
  'partnership': 'monthly',
  'competition': 'weekly',
  'about': 'monthly',
  'contact': 'monthly',
  'community': 'monthly',
  'disclaimer': 'monthly',
  'claim-free-frsc': 'daily',
  'author/faris': 'monthly',
  'faq': 'monthly',
  'cookie-policy': 'monthly',
  'privacy': 'monthly',
  'terms': 'monthly',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = []

  for (const path of staticPaths) {
    for (const locale of locales) {
      const localePath = path === '' ? `/${locale}` : `/${locale}/${path}`
      staticEntries.push({
        url: `${BASE_URL}${localePath}`,
        lastModified: new Date(),
        changeFrequency: staticPathChangeFreq[path] ?? 'monthly',
        priority: staticPathPriorities[path] ?? 0.5,
      })
    }
  }

  const blogPosts = getAllPosts()
  const blogEntries: MetadataRoute.Sitemap = []

  for (const post of blogPosts) {
    for (const locale of locales) {
      const t = post.translations[locale as keyof typeof post.translations]
      if (t?.slug) {
        blogEntries.push({
          url: `${BASE_URL}/${locale}/blog/${t.slug}`,
          lastModified: parseDate(post.date),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  }

  return [...staticEntries, ...blogEntries]
}
