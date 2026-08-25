'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Generator } from '@/components/generator'
import { Gallery } from '@/components/gallery'
import { ProfileCard } from '@/components/profile-card'
import { SupportModal } from '@/components/support-modal'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFRSC } from '@/contexts/FRSCContext'
import { useGenerate } from '@/hooks/useGenerate'
import { GalleryProvider, useGalleryContext } from '@/contexts/GalleryContext'
import { LangContext, useLangState } from '@/hooks/useLang'
import { useUserStats } from '@/hooks/useUserStats'
import type { GeneratedImage } from '@/types'
import { ScrollReveal } from '@/components/scroll-reveal'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { MaintenanceModal } from '@/components/ui/MaintenanceModal'

const pageContent = {
  id: {
    breadcrumbAi: 'AI Tools',
    breadcrumbCurrent: 'Anime Generator',
    description: 'Buat gambar anime berkualitas tinggi dari deskripsi teks dengan AI generatif premium.',
    badge: 'Live',
    faqTitle: 'Tentang Anime Generator',
    faqs: [
      { q: 'Berapa FRSC untuk satu generate?', a: 'Setiap generate membutuhkan 1 FRSC. Kamu bisa mendapatkan FRSC gratis melalui Daily Reward atau membeli paket.' },
      { q: 'Model apa yang digunakan?', a: 'Anime Generator menggunakan model ErosMix yang berjalan di infrastruktur AI generatif self-hosted Farisium dengan akselerasi GPU RTX.' },
      { q: 'Apakah gambar tersimpan?', a: 'Gambar yang dihasilkan tersimpan sementara untuk ditampilkan di galeri. Kamu bisa mengunduh gambar sebelum sesi berakhir.' },
      { q: 'Bagaimana cara menulis prompt yang baik?', a: 'Gunakan deskripsi detail tentang karakter, pakaian, latar, dan suasana. Tombol Enhance akan membantu memperbaiki promptmu secara otomatis.' },
    ],
  },
  en: {
    breadcrumbAi: 'AI Tools',
    breadcrumbCurrent: 'Anime Generator',
    description: 'Create high-quality anime images from text descriptions using premium AI generation.',
    badge: 'Live',
    faqTitle: 'About Anime Generator',
    faqs: [
      { q: 'How many FRSC per generation?', a: 'Each generation costs 1 FRSC. You can earn free FRSC through Daily Rewards or purchase packages.' },
      { q: 'What model is used?', a: 'Anime Generator uses the ErosMix model running on Farisium\'s self-hosted AI infrastructure with RTX GPU acceleration.' },
      { q: 'Are images saved?', a: 'Generated images are temporarily saved for gallery display. You can download your images before the session ends.' },
      { q: 'How to write a good prompt?', a: 'Use detailed descriptions of characters, clothing, background, and atmosphere. The Enhance button will automatically improve your prompt.' },
    ],
  },
}

export default function AnimeGeneratorPage() {
  const auth = useAuthContext()
  const langState = useLangState()
  const c = pageContent[langState.lang] ?? pageContent.id

  return (
    <LangContext.Provider value={langState}>
      <GalleryProvider>
        <PageContent c={c} />
      </GalleryProvider>
    </LangContext.Provider>
  )
}

function PageContent({ c }: { c: (typeof pageContent)['id'] }) {
  const auth = useAuthContext()
  const { coins, deductCoin, addCoin, incrementGeneration } = useFRSC()
  const { generate, isLoading, progress, error, queueJob } = useGenerate()
  const { addImage } = useGalleryContext()
  const { generations } = useUserStats()
  const [supportOpen, setSupportOpen] = useState(false)
  const [latestResult, setLatestResult] = useState<GeneratedImage | null>(null)

  const handleRewardClaim = async () => {
    await addCoin()
  }

  const handleGenerate = async (prompt: string) => {
    if (coins <= 0) return

    const genResult = await generate(prompt)

    if (genResult.success && genResult.base64) {
      addImage(genResult.id!, genResult.base64, genResult.prompt!)

      setLatestResult({
        id: genResult.id!,
        url: genResult.base64,
        prompt: genResult.prompt!,
        createdAt: Date.now(),
      })

      await deductCoin()
      await incrementGeneration()
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1 blur-[2px] brightness-75 pointer-events-none select-none">
        {/* Page Header */}
        <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-6">
          <nav className="mb-4 flex items-center gap-2 text-xs text-frsc-text-300" aria-label="Breadcrumb">
            <Link href="/ai" className="transition-colors hover:text-foreground">{c.breadcrumbAi}</Link>
            <span className="text-frsc-text-300/50" aria-hidden="true">/</span>
            <span aria-current="page" className="text-foreground">{c.breadcrumbCurrent}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-700/30 shadow-[0_0_24px_rgba(224,48,78,0.08)]">
              <Image
                src="/anime-generator-icon.png"
                alt="Anime Generator"
                width={36}
                height={36}
                className="h-9 w-9"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="heading-fluid text-h2 text-foreground">
                  Anime Generator
                </h1>
                <Badge variant="crimson" size="sm">{c.badge}</Badge>
              </div>
              <p className="mt-1 text-pretty text-sm text-frsc-text-200">
                {c.description}
              </p>
            </div>
          </div>
        </div>

        {/* Generator section */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-6 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <Generator
              onGenerate={handleGenerate}
              onBuyCoins={() => setSupportOpen(true)}
              onRewardClaim={handleRewardClaim}
              isLoggedIn={!!auth.user}
              isLoading={isLoading}
              progress={progress}
              error={error}
              result={latestResult}
              coins={coins}
              queueJob={queueJob}
            />

            <ProfileCard
              auth={auth}
              generations={generations}
              coins={coins}
              onBuyCoins={() => setSupportOpen(true)}
            />
          </div>
        </section>

        {/* Ad slot placeholder */}
        <div className="mt-4 flex justify-center px-2">
          <div
            className="mx-auto flex w-full max-w-xl items-center justify-center overflow-hidden rounded-xl border border-dashed border-frsc-surface-600/40 bg-frsc-surface-800/20"
            style={{ minHeight: 90 }}
          >
            <span className="text-[10px] text-frsc-text-300/30">AdSpace</span>
          </div>
        </div>

        <Gallery />

        {/* FAQ for SEO */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-8 text-foreground">
            {c.faqTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.faqs.map(({ q, a }) => (
              <div key={q} className="reveal-on-scroll reveal-stagger hover-lift rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic">
                <h3 className="mb-2 text-sm font-semibold text-frsc-white-bright">{q}</h3>
                <p className="text-sm text-frsc-text-200 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <ScrollReveal />
      <MaintenanceModal />
    </div>
  )
}
