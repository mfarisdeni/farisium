'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Copy,
  Check,
  CheckCircle,
  Loader2,
  Sparkles,
  Coins,
  LogIn,
  MessageSquare,
  MessageSquareText,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ProfileCard } from '@/components/profile-card'
import { SupportModal } from '@/components/support-modal'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Button } from '@/components/ui/button'
import { Input, TextArea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFRSC } from '@/contexts/FRSCContext'
import { LangContext, useLangState, useLang } from '@/hooks/useLang'
import { MaintenanceModal } from '@/components/ui/MaintenanceModal'

interface SEOResult {
  seoTitles: string[]
  shortCaption: string
  longCaption: string
  marketplaceDescription: string
  instagramCaption: string
  tiktokCaption: string
  hashtags: string[]
  searchKeywords: string[]
  cta: string
}

const languageOptions = [
  { value: 'indonesian', label: 'Indonesia' },
  { value: 'english', label: 'English' },
]

const pageContent = {
  id: {
    breadcrumbAi: 'AI Tools',
    breadcrumbCurrent: 'SEO Caption Generator',
    title: 'SEO Caption Generator',
    badge: 'Live',
    description:
      'Buat caption produk dan konten media sosial yang dioptimalkan untuk SEO dengan AI.',
    formInfoTitle: 'Informasi Produk',
    productNamePlaceholder: 'Nama produk atau brand',
    productNameAria: 'Nama produk',
    descPlaceholder:
      'Contoh: Sepatu sneakers ringan, nyaman dipakai harian, desain 2 warna, cocok untuk jalan santai dan aktivitas kasual.',
    descAria: 'Deskripsi produk',
    langSection: 'Bahasa',
    platformSection: 'Fokus Platform',
    audienceSection: 'Target Audiens',
    toneSection: 'Gaya Caption',
    audienceHelp: 'Bisa pilih lebih dari satu. Kosong = Umum.',
    platforms: [
      { value: 'shopee-tokopedia', label: 'Shopee / Tokopedia' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'website', label: 'Website' },
      { value: 'all', label: 'Semua Platform' },
    ],
    toneOptions: [
      { value: 'casual', label: 'Santai' },
      { value: 'professional', label: 'Profesional' },
      { value: 'persuasive', label: 'Iklan' },
    ],
    audienceOptions: [
      { value: 'Umum', label: 'Umum' },
      { value: 'Gen Z', label: 'Gen Z' },
      { value: 'Millennial', label: 'Millennial' },
      { value: 'Dewasa', label: 'Dewasa' },
    ],
    generateBtn: 'Buat Caption',
    generatingBtn: 'Sedang Membuat...',
    loginBtn: 'Login untuk Generate',
    costLabel: '1 FRSC / generate',
    insufficientCoins: 'FRSC tidak cukup.',
    topUp: 'Top up sekarang',
    generateError: 'Gagal membuat caption',
    errorFallback: 'Terjadi kesalahan. Silakan coba lagi.',
    successMsg:
      'Caption berhasil dibuat. Kamu bisa menyalin setiap bagian sesuai kebutuhan.',
    resultLabelTitles: 'Judul SEO',
    resultLabelShortCaption: 'Caption Singkat',
    resultLabelLongCaption: 'Caption Panjang',
    resultLabelMarketplace: 'Deskripsi Marketplace',
    resultLabelInstagram: 'Caption Instagram',
    resultLabelTikTok: 'Caption TikTok',
    resultLabelHashtags: 'Hashtag',
    resultLabelKeywords: 'Kata Kunci Pencarian',
    resultLabelCTA: 'CTA',
    loadingSteps: [
      'Mengumpulkan informasi produk...',
      'Menganalisis kata kunci SEO...',
      'Menyesuaikan gaya caption...',
      'Membuat deskripsi marketplace...',
      'Merapikan hasil akhir...',
    ],
    faqTitle: 'Pertanyaan yang Sering Ditanyakan',
    faqs: [
      {
        q: 'Apa itu SEO Caption Generator?',
        a: 'SEO Caption Generator adalah tools AI untuk membuat caption produk, deskripsi marketplace, dan konten media sosial yang dioptimalkan untuk SEO dan algoritma platform seperti Shopee, Tokopedia, Instagram, dan TikTok.',
      },
      {
        q: 'Berapa FRSC untuk satu kali generate?',
        a: 'Setiap generate membutuhkan 1 FRSC. Kamu bisa mendapatkan FRSC gratis melalui Daily Reward atau membeli paket FRSC.',
      },
      {
        q: 'Platform apa saja yang didukung?',
        a: 'Tools ini mendukung Shopee, Tokopedia, Instagram, TikTok, dan Website. Kamu bisa memilih platform yang sesuai dengan kebutuhanmu.',
      },
      {
        q: 'Model AI apa yang digunakan?',
        a: 'SEO Caption Generator menggunakan Ollama dengan model llama3.2:3b yang berjalan di infrastruktur Farisium.',
      },
      {
        q: 'Apakah hasilnya bisa diedit?',
        a: 'Tentu saja. Hasil yang diberikan adalah draf awal yang bisa kamu edit dan sesuaikan dengan kebutuhan branding dan gaya komunikasi bisnismu.',
      },
      {
        q: 'Bagaimana cara mendapatkan FRSC?',
        a: 'Kamu bisa mendapatkan FRSC gratis setiap hari melalui Daily Reward atau membeli paket FRSC melalui halaman Top Up.',
      },
    ],
    adSpace: 'AdSpace',
    profileGenerationsLabel: 'Captions Generated',
  },
  en: {
    breadcrumbAi: 'AI Tools',
    breadcrumbCurrent: 'SEO Caption Generator',
    title: 'SEO Caption Generator',
    badge: 'Live',
    description:
      'Create product captions and social media content optimized for SEO with AI.',
    formInfoTitle: 'Product Information',
    productNamePlaceholder: 'Product or brand name',
    productNameAria: 'Product name',
    descPlaceholder:
      'Example: Lightweight sneakers, comfortable for daily wear, 2-color design, suitable for casual walks and daily activities.',
    descAria: 'Product description',
    langSection: 'Language',
    platformSection: 'Platform Focus',
    audienceSection: 'Target Audience',
    toneSection: 'Caption Style',
    audienceHelp: 'You can select more than one. Empty = General.',
    platforms: [
      { value: 'shopee-tokopedia', label: 'Shopee / Tokopedia' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'website', label: 'Website' },
      { value: 'all', label: 'All Platforms' },
    ],
    toneOptions: [
      { value: 'casual', label: 'Casual' },
      { value: 'professional', label: 'Professional' },
      { value: 'persuasive', label: 'Advertising' },
    ],
    audienceOptions: [
      { value: 'Umum', label: 'General' },
      { value: 'Gen Z', label: 'Gen Z' },
      { value: 'Millennial', label: 'Millennial' },
      { value: 'Dewasa', label: 'Adult' },
    ],
    generateBtn: 'Generate Caption',
    generatingBtn: 'Generating...',
    loginBtn: 'Login to Generate',
    costLabel: '1 FRSC / generate',
    insufficientCoins: 'Insufficient FRSC.',
    topUp: 'Top up now',
    generateError: 'Failed to generate caption',
    errorFallback: 'An error occurred. Please try again.',
    successMsg:
      'Caption generated successfully. You can copy each section as needed.',
    resultLabelTitles: 'SEO Titles',
    resultLabelShortCaption: 'Short Caption',
    resultLabelLongCaption: 'Long Caption',
    resultLabelMarketplace: 'Marketplace Description',
    resultLabelInstagram: 'Instagram Caption',
    resultLabelTikTok: 'TikTok Caption',
    resultLabelHashtags: 'Hashtags',
    resultLabelKeywords: 'Search Keywords',
    resultLabelCTA: 'CTA',
    loadingSteps: [
      'Gathering product information...',
      'Analyzing SEO keywords...',
      'Adjusting caption style...',
      'Creating marketplace description...',
      'Finalizing the results...',
    ],
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'What is SEO Caption Generator?',
        a: 'SEO Caption Generator is an AI tool for creating product captions, marketplace descriptions, and social media content optimized for SEO and platform algorithms like Shopee, Tokopedia, Instagram, and TikTok.',
      },
      {
        q: 'How many FRSC per generation?',
        a: 'Each generation costs 1 FRSC. You can earn free FRSC through Daily Rewards or purchase FRSC packages.',
      },
      {
        q: 'What platforms are supported?',
        a: 'This tool supports Shopee, Tokopedia, Instagram, TikTok, and Website. You can choose the platform that suits your needs.',
      },
      {
        q: 'What AI model is used?',
        a: 'SEO Caption Generator uses Ollama with the llama3.2:3b model running on Farisium\'s infrastructure.',
      },
      {
        q: 'Can the results be edited?',
        a: 'Absolutely. The results are initial drafts that you can edit and adjust to fit your branding and business communication style.',
      },
      {
        q: 'How do I get FRSC?',
        a: 'You can get free FRSC every day through Daily Rewards or purchase FRSC packages through the Top Up page.',
      },
    ],
    adSpace: 'AdSpace',
    profileGenerationsLabel: 'Captions Generated',
  },
}

function OptionChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
        selected
          ? 'border-frsc-crimson-500/40 bg-gradient-to-b from-frsc-crimson-800/30 to-frsc-purple-800/20 text-frsc-crimson-200 shadow-[0_0_20px_rgba(224,48,78,0.12)]'
          : 'border-white/[0.06] bg-white/[0.02] text-frsc-text-200 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-frsc-text-100'
      }`}
    >
      {children}
    </button>
  )
}

function OptionChipMulti({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
        selected
          ? 'border-frsc-purple-500/40 bg-gradient-to-b from-frsc-purple-800/30 to-frsc-crimson-800/20 text-frsc-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.12)]'
          : 'border-white/[0.06] bg-white/[0.02] text-frsc-text-200 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-frsc-text-100'
      }`}
    >
      {children}
    </button>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const { lang } = useLang()

  const copyLabel = lang === 'en' ? 'Copy' : 'Salin'
  const copiedLabel = lang === 'en' ? 'Copied' : 'Tersalin'

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* silent fail */
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-white/[0.06] active:scale-95"
    >
      {copied ? (
        <>
          <Check className="size-3 text-green-400" />
          <span className="text-green-400">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="size-3 text-frsc-text-300" />
          <span className="text-frsc-text-300">{copyLabel}</span>
        </>
      )}
    </button>
  )
}

function ResultCard({
  label,
  children,
  copyText,
  charCount,
}: {
  label: string
  children: React.ReactNode
  copyText: string
  charCount?: number
}) {
  const { lang } = useLang()
  const charCountLabel = lang === 'en' ? 'characters' : 'karakter'

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-frsc-white-bright">
            {label}
          </h3>
          {charCount !== undefined && (
            <span className="text-[11px] text-frsc-text-300/60">
              {charCount} {charCountLabel}
            </span>
          )}
        </div>
        <CopyButton text={copyText} />
      </div>
      <div className="text-sm leading-relaxed text-frsc-text-200">
        {children}
      </div>
    </div>
  )
}

export default function SEOCaptionGeneratorPage() {
  const langState = useLangState()
  const c = pageContent[langState.lang] ?? pageContent.id

  return (
    <LangContext.Provider value={langState}>
      <PageContent c={c} />
    </LangContext.Provider>
  )
}

function PageContent({ c }: { c: (typeof pageContent)['id'] }) {
  const auth = useAuthContext()
  const { coins, deductCoin, incrementCaptionGeneration, captionGenerations } =
    useFRSC()
  const [supportOpen, setSupportOpen] = useState(false)

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('indonesian')
  const [platform, setPlatform] = useState('')
  const [targetAudiences, setTargetAudiences] = useState<string[]>([])
  const [tone, setTone] = useState('')

  const [loading, setLoading] = useState(false)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SEOResult | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const formValid =
    productName.trim().length >= 2 &&
    description.trim().length >= 10 &&
    platform !== '' &&
    tone !== ''

  const toggleAudience = (value: string) => {
    setTargetAudiences((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    )
  }

  useEffect(() => {
    if (loading) {
      setLoadingStepIndex(0)
      intervalRef.current = setInterval(() => {
        setLoadingStepIndex((prev) => {
          if (prev >= 4) return 4
          return prev + 1
        })
      }, 3000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setLoadingStepIndex(0)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [loading])

  const handleGenerate = async () => {
    if (!auth.user) return
    if (!formValid || loading) return
    if (coins <= 0) {
      setSupportOpen(true)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setShowSuccess(false)

    try {
      const res = await fetch('/api/ai/seo-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: auth.user.uid,
          productName: productName.trim(),
          description: description.trim(),
          platform,
          targetAudiences:
            targetAudiences.length > 0 ? targetAudiences : ['Umum'],
          tone,
          language,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? c.generateError)
      }

      setResult(json.data)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)

      await deductCoin()
      await incrementCaptionGeneration()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : c.errorFallback,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1 blur-[2px] brightness-75 pointer-events-none select-none">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-6">
          <nav
            className="mb-4 flex items-center gap-2 text-xs text-frsc-text-300"
            aria-label="Breadcrumb"
          >
            <Link
              href="/ai"
              className="transition-colors hover:text-foreground"
            >
              {c.breadcrumbAi}
            </Link>
            <span className="text-frsc-text-300/50" aria-hidden="true">
              /
            </span>
            <span aria-current="page" className="text-foreground">
              {c.breadcrumbCurrent}
            </span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-700/30 shadow-[0_0_24px_rgba(224,48,78,0.08)]">
              <MessageSquare className="h-7 w-7 text-frsc-crimson-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="heading-fluid text-h2 text-foreground">
                  {c.title}
                </h1>
                <Badge variant="crimson" size="sm">
                  {c.badge}
                </Badge>
              </div>
              <p className="mt-1 text-pretty text-sm text-frsc-text-200">
                {c.description}
              </p>
            </div>
          </div>
        </div>

        <section className="mx-auto w-full max-w-7xl px-4 pb-6 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] items-start">
            <div>
              {/* Form */}
              <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-6 shadow-metallic">
                {/* Informasi Produk */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="size-4 text-frsc-crimson-400" />
                    <h2 className="text-sm font-semibold text-frsc-white-bright">
                      {c.formInfoTitle}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder={c.productNamePlaceholder}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        aria-label={c.productNameAria}
                        inputSize="lg"
                      />
                    </div>
                    <div>
                      <TextArea
                        placeholder={c.descPlaceholder}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        aria-label={c.descAria}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Bahasa */}
                <div className="mb-8">
                  <h2 className="mb-3 text-xs font-medium text-frsc-text-300">
                    {c.langSection}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((l) => (
                      <OptionChip
                        key={l.value}
                        selected={language === l.value}
                        onClick={() => setLanguage(l.value)}
                      >
                        {l.label}
                      </OptionChip>
                    ))}
                  </div>
                </div>

                {/* Fokus Platform */}
                <div className="mb-8">
                  <h2 className="mb-3 text-xs font-medium text-frsc-text-300">
                    {c.platformSection}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {c.platforms.map((p: { value: string; label: string }) => (
                      <OptionChip
                        key={p.value}
                        selected={platform === p.value}
                        onClick={() => setPlatform(p.value)}
                      >
                        {p.label}
                      </OptionChip>
                    ))}
                  </div>
                </div>

                {/* Target Audiens */}
                <div className="mb-8">
                  <h2 className="mb-3 text-xs font-medium text-frsc-text-300">
                    {c.audienceSection}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {c.audienceOptions.map((a: { value: string; label: string }) => (
                      <OptionChipMulti
                        key={a.value}
                        selected={targetAudiences.includes(a.value)}
                        onClick={() => toggleAudience(a.value)}
                      >
                        {a.label}
                      </OptionChipMulti>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-frsc-text-300/50">
                    {c.audienceHelp}
                  </p>
                </div>

                {/* Gaya Caption */}
                <div className="mb-8">
                  <h2 className="mb-3 text-xs font-medium text-frsc-text-300">
                    {c.toneSection}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {c.toneOptions.map((t: { value: string; label: string }) => (
                      <OptionChip
                        key={t.value}
                        selected={tone === t.value}
                        onClick={() => setTone(t.value)}
                      >
                        {t.label}
                      </OptionChip>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    {auth.user ? (
                      <Button
                        variant="crimson"
                        size="lg"
                        disabled={!formValid || loading || coins <= 0}
                        onClick={handleGenerate}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            {c.generatingBtn}
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-4" />
                            {c.generateBtn}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button variant="crimson" size="lg" disabled>
                        <LogIn className="size-4" />
                        {c.loginBtn}
                      </Button>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-frsc-text-300">
                      <Coins className="size-3.5" />
                      <span>{c.costLabel}</span>
                    </div>
                  </div>
                </div>

                {auth.user && coins <= 0 && (
                  <p className="mt-3 text-xs text-frsc-crimson-400">
                    {c.insufficientCoins}{' '}
                    <button
                      type="button"
                      onClick={() => setSupportOpen(true)}
                      className="underline hover:no-underline"
                    >
                      {c.topUp}
                    </button>
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Loading status */}
              {loading && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic">
                    <div className="mb-4 flex items-center gap-3">
                      <Loader2 className="size-5 animate-spin text-frsc-crimson-400" />
                      <p className="text-sm font-medium text-frsc-white-bright">
                        {c.loadingSteps[loadingStepIndex]}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {c.loadingSteps.map((_: string, i: number) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            i <= loadingStepIndex
                              ? 'bg-frsc-crimson-500/60'
                              : 'bg-white/[0.06]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Skeleton */}
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/[0.06] bg-frsc-surface-800/60 p-5"
                      >
                        <div className="mb-3 h-4 w-24 rounded bg-white/[0.06]" />
                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-white/[0.04]" />
                          <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {result && !loading && (
                <div className="mt-6 space-y-4">
                  {/* Success notification */}
                  {showSuccess && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-400" />
                      <p>{c.successMsg}</p>
                    </div>
                  )}

                  <ResultCard
                    label={c.resultLabelTitles}
                    copyText={(result.seoTitles || []).join('\n')}
                  >
                    <div className="flex flex-wrap gap-2">
                      {(result.seoTitles || []).map((title, i) => (
                        <span
                          key={i}
                          className="inline-flex rounded-full border border-frsc-crimson-700/30 bg-frsc-crimson-900/20 px-3 py-1 text-xs text-frsc-crimson-300"
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelShortCaption}
                    copyText={result.shortCaption || ''}
                  >
                    <p>{result.shortCaption || ''}</p>
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelLongCaption}
                    copyText={result.longCaption || ''}
                    charCount={(result.longCaption || '').replace(/\s/g, '').length}
                  >
                    {(result.longCaption || '').split('\n').map((p, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {p}
                      </p>
                    ))}
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelMarketplace}
                    copyText={result.marketplaceDescription || ''}
                    charCount={
                      (result.marketplaceDescription || '').replace(/\s/g, '').length
                    }
                  >
                    {(result.marketplaceDescription || '').split('\n').map((p, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {p}
                      </p>
                    ))}
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelInstagram}
                    copyText={result.instagramCaption || ''}
                  >
                    <p>{result.instagramCaption || ''}</p>
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelTikTok}
                    copyText={result.tiktokCaption || ''}
                  >
                    <p>{result.tiktokCaption || ''}</p>
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelHashtags}
                    copyText={(result.hashtags || []).join(' ')}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {(result.hashtags || []).map((tag, i) => (
                        <span key={i} className="text-frsc-purple-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelKeywords}
                    copyText={(result.searchKeywords || []).join(', ')}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {(result.searchKeywords || []).map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex rounded-md border border-border bg-frsc-surface-700/60 px-2 py-0.5 text-xs text-frsc-text-200"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </ResultCard>

                  <ResultCard
                    label={c.resultLabelCTA}
                    copyText={result.cta || ''}
                  >
                    <p className="text-frsc-crimson-300">{result.cta || ''}</p>
                  </ResultCard>
                </div>
              )}
            </div>

            <aside className="self-start h-fit lg:sticky lg:top-24">
              <ProfileCard
                auth={auth}
                generations={captionGenerations}
                coins={coins}
                onBuyCoins={() => setSupportOpen(true)}
                generationsLabel={c.profileGenerationsLabel}
                generationsIcon={
                  <MessageSquareText className="size-3.5 text-frsc-crimson-400" />
                }
              />
            </aside>
          </div>
        </section>

        {/* Ad slot */}
        <div className="mt-4 flex justify-center px-2">
          <div
            className="mx-auto flex w-full max-w-xl items-center justify-center overflow-hidden rounded-xl border border-dashed border-frsc-surface-600/40 bg-frsc-surface-800/20"
            style={{ minHeight: 90 }}
          >
            <span className="text-[10px] text-frsc-text-300/30">{c.adSpace}</span>
          </div>
        </div>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-6">
          <h2 className="heading-fluid text-h3 mb-8 text-foreground">
            {c.faqTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.faqs.map(({ q, a }: { q: string; a: string }) => (
              <div
                key={q}
                className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800 p-5 shadow-metallic"
              >
                <h3 className="mb-2 text-sm font-semibold text-frsc-white-bright">
                  {q}
                </h3>
                <p className="text-sm leading-relaxed text-frsc-text-200">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      <SupportModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
      <ScrollReveal />
      <MaintenanceModal />
    </div>
  )
}
