'use client'

import { useLang } from '@/hooks/useLang'
import { getLegalContent } from '@/lib/legal-content'

interface LegalContentProps {
  type: 'terms' | 'privacy'
}

export function LegalContent({ type }: LegalContentProps) {
  const { lang, t } = useLang()
  const doc = getLegalContent(type, lang)

  const labels: Record<string, { title: string; lastUpdated: string }> = {
    terms: {
      title:
        lang === 'id'
          ? 'Syarat & Ketentuan'
          : 'Terms of Service',
      lastUpdated:
        lang === 'id'
          ? 'Terakhir diperbarui'
          : 'Last updated',
    },
    privacy: {
      title:
        lang === 'id'
          ? 'Kebijakan Privasi'
          : 'Privacy Policy',
      lastUpdated:
        lang === 'id'
          ? 'Terakhir diperbarui'
          : 'Last updated',
    },
  }

  const label = labels[type]

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-frsc-white-bright sm:text-4xl">
          {label.title}
        </h1>
        <p className="mt-3 text-sm text-frsc-text-200">
          {label.lastUpdated}: {doc.lastUpdated}
        </p>
      </header>

      {/* Sections */}
      <div className="space-y-10">
        {doc.sections.map((section, index) => (
          <section
            key={index}
            className="prose-custom"
          >
            <h2 className="font-heading mb-3 text-lg font-semibold text-frsc-white-bright sm:text-xl">
              {index + 1}. {section.title}
            </h2>
            <div className="text-base leading-relaxed text-frsc-text-200">
              {section.body.split('\n').map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
