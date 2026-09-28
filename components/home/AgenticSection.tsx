import Link from 'next/link'
import {
  ReceiptText,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  ArrowRight,
  Headphones,
  FileText,
  Wallet,
  PackageSearch,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Lang } from '@/lib/translations'

const revealDelays = [
  'reveal-delay-1',
  'reveal-delay-2',
  'reveal-delay-3',
  'reveal-delay-4',
] as const

/**
 * Icon tiles keep the brand duo (crimson / purple / silver) but drop the
 * red-on-red look: every icon is white on a distinct, high-contrast tile.
 */
type AccentKey = 'crimson' | 'silver' | 'purple' | 'deep'

const accents: Record<AccentKey, { tile: string; icon: string; tick: string }> = {
  crimson: {
    tile: 'bg-frsc-crimson-600/30 ring-1 ring-inset ring-frsc-crimson-300/45 shadow-[0_6px_20px_-8px_rgba(224,48,78,0.65)]',
    icon: 'text-white',
    tick: 'text-frsc-crimson-300',
  },
  silver: {
    tile: 'bg-gradient-to-br from-frsc-silver/25 to-white/[0.04] ring-1 ring-inset ring-white/25',
    icon: 'text-white',
    tick: 'text-frsc-platinum',
  },
  purple: {
    tile: 'bg-frsc-purple-600/35 ring-1 ring-inset ring-frsc-purple-300/45 shadow-[0_6px_20px_-8px_rgba(100,47,127,0.7)]',
    icon: 'text-white',
    tick: 'text-frsc-purple-300',
  },
  deep: {
    tile: 'bg-frsc-crimson-900/70 ring-1 ring-inset ring-frsc-crimson-300/35',
    icon: 'text-white',
    tick: 'text-frsc-crimson-300',
  },
}

interface Props {
  lang?: Lang
}

export function AgenticSection({ lang = 'id' }: Props) {
  const labels = {
    id: {
      badge: 'Agentic AI',
      heading: 'Agen AI yang Bekerja untuk Kamu',
      description:
        'Berbeda dari chatbot, setiap agen di Farisium mengerjakan satu tugas nyata sampai selesai — dari file yang kamu unggah sampai dokumen final yang siap dipakai. Kamu cukup mengunggah, memeriksa, lalu mengunduh.',
      meta: '4 agen aktif · Excel 3 sheet & PDF multi-halaman · file dihapus otomatis setelah diproses',
      cta: 'Coba Agen Ini',
      indexLabel: 'Agen',
      agents: [
        {
          icon: Wallet,
          accent: 'crimson' as AccentKey,
          name: 'AI Expense Report Generator',
          description:
            'Unggah banyak struk sekaligus. Agen membaca tiap struk, mengekstrak tanggal, merchant, item, dan total, lalu mengkategorikan pengeluarannya sebelum kamu periksa.',
          checklist: [
            'Satu struk per baris, sepuluh struk per laporan',
            'Tanggal, merchant, item, dan total dibaca lalu dikategorikan otomatis',
            'Struk duplikat terdeteksi sebelum laporan diekspor',
          ],
          href: '/ai/expense-report',
        },
        {
          icon: ReceiptText,
          accent: 'silver' as AccentKey,
          name: 'Struk Belanja ke Excel',
          description:
            'Arahkan kamera ke struk belanja dan agen membaca setiap baris, memisahkan subtotal, pajak, dan diskon, lalu menyusun file Excel yang rapi.',
          checklist: [
            'Ekstraksi dua tahap dengan angka yang diverifikasi ulang',
            'Validasi aritmatika untuk subtotal, pajak, dan diskon',
            'Baris yang perlu diperiksa ditandai sebelum diunduh',
          ],
          href: '/ai/receipt-to-excel',
        },
        {
          icon: FileSpreadsheet,
          accent: 'purple' as AccentKey,
          name: 'Foto ke Invoice',
          description:
            'Unggah atau foto invoice, struk, atau tagihan. Agen menyusun invoice digital profesional dengan template minimalis yang siap dikirim ke klien.',
          checklist: [
            'Seller, buyer, item, pajak, dan total terbaca sekaligus',
            'Preview final, lalu unduh PDF plain & Excel yang bisa diedit',
            'Nomor invoice dan tanggal devise mengikuti format dokumen asli',
          ],
          href: '/ai/image-to-invoice',
        },
        {
          icon: PackageSearch,
          accent: 'deep' as AccentKey,
          name: 'Product Catalog AI Agent',
          description:
            'Unggah screenshot katalog marketplace. Agen membaca tiap kartu produk, memisahkan harga coret dari harga yang dibayar, dan menempelkan nama toko dari header di atasnya.',
          checklist: [
            'Nama, varian, toko, harga, rating, dan terjual per kartu produk',
            'Baris perlu diperiksa & produk duplikat ditandai sebelum ekspor',
            'Katalog siap kirim ke supplier dalam bentuk Excel atau PDF',
          ],
          href: '/ai/product-catalog',
        },
      ],
      toolCta: 'Buka',
      moreLabel: 'Alat lain di Farisium',
      tools: [
        {
          icon: Headphones,
          accent: 'purple' as AccentKey,
          name: 'F-Stream Boost',
          description: 'Kampanye Spotify dikelola AI agent — lagu di-pitch ke kurator playlist dan iklan dijalankan otomatis.',
          href: '/ai/f-stream-spotify-promotion',
        },
        {
          icon: FileText,
          accent: 'silver' as AccentKey,
          name: 'AI Blog',
          description: 'Wawasan dan berita AI yang ditulis untuk membantu keputusanmu.',
          href: '/blog',
        },
      ],
    },
    en: {
      badge: 'Agentic AI',
      heading: 'AI Agents That Work for You',
      description:
        'Unlike a chatbot, every Farisium agent finishes one real job end to end — from the file you upload to the final document you can use. You just upload, review, and download.',
      meta: '4 agents live · 3-sheet Excel & multi-page PDF · files auto-deleted after processing',
      cta: 'Try This Agent',
      indexLabel: 'Agent',
      agents: [
        {
          icon: Wallet,
          accent: 'crimson' as AccentKey,
          name: 'AI Expense Report Generator',
          description:
            'Upload many receipts at once. The agent reads each one, extracts the date, merchant, items, and total, then categorizes the expense before you review it.',
          checklist: [
            'One receipt per row, ten receipts per report',
            'Date, merchant, items, and total read and categorized automatically',
            'Duplicate receipts detected before the report is exported',
          ],
          href: '/ai/expense-report',
        },
        {
          icon: ReceiptText,
          accent: 'silver' as AccentKey,
          name: 'Image Receipt to Excel',
          description:
            'Point your camera at a store receipt and the agent reads every line, separates the subtotal, tax, and discount, then produces a clean Excel file.',
          checklist: [
            'Two-stage extraction with re-verified numbers',
            'Automatic math validation for subtotals, tax, and discounts',
            'Rows needing review are flagged before download',
          ],
          href: '/ai/receipt-to-excel',
        },
        {
          icon: FileSpreadsheet,
          accent: 'purple' as AccentKey,
          name: 'Image to Invoice',
          description:
            'Upload or photograph an invoice, receipt, or bill. The agent builds a professional digital invoice with a minimal template ready to send to a client.',
          checklist: [
            'Seller, buyer, items, tax, and total read in one pass',
            'Final preview, then download a plain PDF and an editable Excel file',
            'Invoice number and dates follow the original document format',
          ],
          href: '/ai/image-to-invoice',
        },
        {
          icon: PackageSearch,
          accent: 'deep' as AccentKey,
          name: 'Product Catalog AI Agent',
          description:
            'Upload marketplace catalog screenshots. The agent reads every product card, separates the struck-through price from the payable one, and attaches the shop name from the header above it.',
          checklist: [
            'Name, variant, store, price, rating, and sold count per product card',
            'Rows needing review and duplicate products flagged before export',
            'A catalog ready to send to suppliers as Excel or PDF',
          ],
          href: '/ai/product-catalog',
        },
      ],
      toolCta: 'Open',
      moreLabel: 'More on Farisium',
      tools: [
        {
          icon: Headphones,
          accent: 'purple' as AccentKey,
          name: 'F-Stream Boost',
          description: 'AI agent-run Spotify campaigns — tracks pitched to playlist curators and ads run automatically.',
          href: '/ai/f-stream-spotify-promotion',
        },
        {
          icon: FileText,
          accent: 'silver' as AccentKey,
          name: 'AI Blog',
          description: 'AI insights and news written to help you make better decisions.',
          href: '/blog',
        },
      ],
    },
  }

  const label = labels[lang] ?? labels.id

  return (
    <section
      className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:py-24 lg:px-6"
      aria-labelledby="agentic-heading"
    >
      {/* Subtle background ambient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-16 h-72 w-72 rounded-full bg-frsc-crimson-500/[0.06] blur-3xl" />
        <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-frsc-purple-500/[0.05] blur-3xl" />
      </div>

      <div className="mb-14 text-center">
        <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">{label.badge}</span>
        <h2 id="agentic-heading" className="heading-fluid text-h2 text-frsc-text-100 text-balance">
          {label.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-frsc-text-200">
          {label.description}
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-frsc-text-200">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-frsc-crimson-400" />
          {label.meta}
        </p>
      </div>

      {/* Agent cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {label.agents.map(({ icon: Icon, accent, name, description, checklist, href }, i) => {
          const tone = accents[accent]
          return (
            <GlassCard
              key={name}
              variant="premium"
              blur="medium"
              withReflection={true}
              withAccent="crimson"
              withShimmer={true}
              className="flex flex-col p-7 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] md:p-9"
            >
              <div className="relative z-[2] flex flex-1 flex-col">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone.tile}`}>
                    <Icon className={`h-[22px] w-[22px] ${tone.icon}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[11px] tracking-[0.18em] text-frsc-text-300">
                      {String(i + 1).padStart(2, '0')} · {label.indexLabel}
                    </span>
                    <h3 className="heading-fluid text-h3 mt-1 text-frsc-text-100">{name}</h3>
                  </div>
                </div>

                <p className="mt-5 text-pretty text-sm leading-relaxed text-frsc-text-200">
                  {description}
                </p>

                <ul className="mt-5 flex flex-1 flex-col gap-2">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-frsc-text-200">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tone.tick}`} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <Link
                    href={href}
                    className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-700 to-frsc-crimson-600 px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 transition-all duration-300 hover:shadow-[0_0_28px_rgba(224,48,78,0.35)] active:scale-[0.97]"
                  >
                    {label.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Supporting tools */}
      <div className="mt-16">
        <span className="kicker mb-0">
          <span className="kicker-line" aria-hidden="true" />
          {label.moreLabel}
        </span>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {label.tools.map(({ icon: Icon, accent, name, description, href }, i) => {
            const tone = accents[accent]
            return (
              <Link
                key={name}
                href={href}
                className={`group/agent reveal-on-scroll reveal-stagger ${revealDelays[i % revealDelays.length]} flex flex-col`}
              >
                <GlassCard
                  variant="default"
                  blur="light"
                  withReflection={true}
                  withAccent="crimson"
                  className="hover-lift h-full p-6 transition-colors duration-300 hover:border-white/15"
                >
                  <div className="relative z-[2] flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.tile}`}>
                      <Icon className={`h-5 w-5 ${tone.icon}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-heading text-base font-semibold text-frsc-text-100">{name}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-frsc-text-200">{description}</p>
                    </div>
                  </div>
                  <div className="relative z-[2] mt-5 flex items-center gap-1 text-xs font-medium text-frsc-text-200 transition-all duration-300 group-hover/agent:gap-2 group-hover/agent:text-frsc-text-100">
                    {label.toolCta}
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/agent:translate-x-0.5" />
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
