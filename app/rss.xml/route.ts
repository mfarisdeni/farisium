import { getAllPosts, parseDate } from '@/lib/blog'

const BASE_URL = 'https://farisium.com'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()
  const blogSlugs = new Set<string>()
  const items: string[] = []

  for (const post of posts) {
    for (const locale of ['id', 'en'] as const) {
      const t = post.translations[locale as keyof typeof post.translations]
      if (t?.slug && !blogSlugs.has(t.slug)) {
        blogSlugs.add(t.slug)
        const pubDate = parseDate(post.date).toUTCString()
        items.push(`    <item>
      <title>${escapeXml(t.title)}</title>
      <link>${BASE_URL}/blog/${t.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${t.slug}</guid>
      <description>${escapeXml(t.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(t.category)}</category>
    </item>`)
      }
    }
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Farisium Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Artikel, tutorial, dan berita terbaru dari ekosistem Farisium. Pelajari AI, tips prompt engineering, dan perkembangan platform.</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/apple-icon.png</url>
      <title>Farisium Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  })
}
