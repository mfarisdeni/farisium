'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RenderMarkdownLinks } from '@/components/ui/RenderMarkdownLinks'

interface FaqItem {
  question: string
  answer: string
}

interface ArticleFAQProps {
  items: FaqItem[]
  lang?: 'id' | 'en'
  title?: string
}

export function ArticleFAQ({ items, lang = 'id', title }: ArticleFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) return null

  const defaultTitle = lang === 'en' ? 'Frequently Asked Questions' : 'Pertanyaan Umum'

  return (
    <section className="mt-14 border-t border-white/[0.06] pt-10">
      <h2 className="mb-6 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {title ?? defaultTitle}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-200"
            >
              <button
                type="button"
                id={`article-faq-${i}`}
                aria-controls={`article-faq-panel-${i}`}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-frsc-crimson-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/40 focus-visible:ring-inset"
              >
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4 shrink-0 text-frsc-text-300 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              <div
                id={`article-faq-panel-${i}`}
                role="region"
                aria-labelledby={`article-faq-${i}`}
                className={cn(
                  'grid transition-all duration-300 ease-in-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-white/[0.06] px-5 py-4 text-sm leading-relaxed text-frsc-text-200">
                    <RenderMarkdownLinks text={item.answer} />
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
