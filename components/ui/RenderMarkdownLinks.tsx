'use client'

import Link from 'next/link'

/**
 * Renders `[[label](url)]` patterns as real Next.js <Link> elements.
 * Everything else is rendered as plain text.
 * Used on static pages (About, etc.) where inline link syntax appears
 * in content strings.
 */
export function RenderMarkdownLinks({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\([^)]+\)\])/g)

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[\[([^\]]+)\]\(([^)]+)\)\]$/)
        if (!match) return part
        const [, label, href] = match
        const isExternal = href.startsWith('http')
        if (isExternal) {
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-frsc-crimson-400 underline underline-offset-2 hover:text-frsc-crimson-300 transition-colors">
              {label}
            </a>
          )
        }
        return (
          <Link key={i} href={href} className="text-frsc-crimson-400 underline underline-offset-2 hover:text-frsc-crimson-300 transition-colors">
            {label}
          </Link>
        )
      })}
    </>
  )
}
