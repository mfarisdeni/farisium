'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Lang } from '@/lib/translations'

interface Props {
  lang?: Lang
}

export function FAQSection({ lang = 'id' }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  const labels = {
    id: {
      badge: 'FAQ',
      heading: 'Pertanyaan Umum',
      faqs: [
        {
          q: 'Apa itu Farisium?',
          a: 'Farisium adalah platform AI terpadu yang menyediakan berbagai layanan berbasis Artificial Intelligence dalam satu ekosistem. Dimulai dari Anime Generator, platform ini akan terus berkembang dengan AI Tools baru.',
        },
        {
          q: 'Apa itu FRSC?',
          a: 'FRSC (Farisium Coin) adalah utility point resmi ekosistem Farisium. FRSC digunakan untuk mengakses layanan AI, klaim reward, dan berpartisipasi dalam ekosistem. FRSC bukan mata uang dan bukan instrumen investasi.',
        },
        {
          q: 'Bagaimana cara mendapatkan FRSC secara gratis?',
          a: 'Kamu bisa mendapatkan FRSC melalui Starter Coin saat pertama kali mendaftar, Daily Reward setiap 24 jam, program Referral, Loyalty Reward berdasarkan aktivitas, dan event resmi Farisium.',
        },
        {
          q: 'Apakah Anime Generator aman digunakan?',
          a: 'Ya. AI inference berjalan di infrastruktur self-hosted Farisium. Data dan gambar yang kamu hasilkan tidak dibagikan kepada pihak ketiga untuk tujuan pemasaran.',
        },
        {
          q: 'AI Tools apa saja yang akan hadir?',
          a: 'Roadmap Farisium mencakup SEO Caption Generator, Fium — Turbo Chat Assistant, Subtitle Generator, Blog Writer, dan Influencer Generator. Semua akan tersedia di bawah domain farisium.com/ai.',
        },
      ],
    },
    en: {
      badge: 'FAQ',
      heading: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'What is Farisium?',
          a: 'Farisium is an integrated AI platform that provides various Artificial Intelligence services in one ecosystem. Starting with the Anime Generator, the platform will continue to grow with new AI Tools.',
        },
        {
          q: 'What is FRSC?',
          a: 'FRSC (Farisium Coin) is the official utility point of the Farisium ecosystem. FRSC is used to access AI services, claim rewards, and participate in the ecosystem. FRSC is not a currency or investment instrument.',
        },
        {
          q: 'How do I get FRSC for free?',
          a: 'You can earn FRSC through Starter Coins when first registering, Daily Rewards every 24 hours, the Referral program, Loyalty Rewards based on activity, and official Farisium events.',
        },
        {
          q: 'Is the Anime Generator safe to use?',
          a: 'Yes. AI inference runs on Farisium\'s self-hosted infrastructure. Your data and generated images are not shared with third parties for marketing purposes.',
        },
        {
          q: 'What AI Tools are coming soon?',
          a: 'Farisium\'s roadmap includes SEO Caption Generator, Fium — Turbo Chat Assistant, Subtitle Generator, Blog Writer, and Influencer Generator. All will be available at farisium.com/ai.',
        },
      ],
    },
  }

  const label = labels[lang] ?? labels.id

  return (
    <section
      className="relative mx-auto w-full max-w-3xl px-4 py-16 sm:py-24 lg:px-6"
      aria-labelledby="faq-heading"
    >
      <div className="mb-14 text-center">
        <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{label.badge}</span>
        <h2 id="faq-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
          {label.heading}
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {label.faqs.map(({ q, a }, i) => {
          const isOpen = open === i
          const panelId = `faq-panel-${i}`
          const buttonId = `faq-button-${i}`
          return (
            <GlassCard
              key={i}
              variant="subtle"
              blur="light"
              withReflection={false}
              withAccent="crimson"
              className={`overflow-hidden transition-shadow duration-200 ${isOpen ? 'shadow-metallic-lg' : ''}`}
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="relative z-[2] flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-frsc-white-bright transition-colors duration-200 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/40 focus-visible:ring-inset"
                >
                  <span>{q}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-frsc-text-300 transition-all duration-300 ${
                      isOpen ? 'rotate-180 text-frsc-crimson-400' : ''
                    }`}
                  />
                </button>
              </h3>
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="relative z-[2] border-t border-white/[0.04] px-6 pb-5 pt-4 text-sm leading-relaxed text-frsc-text-200 animate-fade-in"
                >
                  {a}
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
