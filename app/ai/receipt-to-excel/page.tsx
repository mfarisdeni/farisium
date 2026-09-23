'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { useAuthContext } from '@/contexts/AuthContext'
import { LangContext, useLangState, useLang } from '@/hooks/useLang'
import { toast } from 'sonner'
import {
  ReceiptText,
  UploadCloud,
  FileImage,
  Loader2,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Camera,
  X,
} from 'lucide-react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

const pageContent = {
  id: {
    badge: 'AI Agent',
    title: 'Struk ke Excel',
    description:
      'Foto struk atau bukti transaksi apa pun langsung diubah menjadi file Excel yang rapi. Tanpa mengetik manual.',
    stepsLabel: '3 langkah cepat',
    steps: ['Upload foto struk', 'AI membaca & mengoreksi data', 'Download file Excel'],
    uploadTitle: 'Upload Foto Struk',
    uploadHint: 'JPG, PNG, atau WebP — maksimal 10 MB',
    drop: 'Seret & letakkan foto di sini, atau',
    browse: 'Pilih file',
    fileAccepted: 'File siap diproses',
    changeFile: 'Ganti file',
    camera: 'Buka Kamera',
    cameraHint: 'Foto struk langsung dari kamera HP',
    convert: 'Konversi ke Excel',
    converting: 'Memproses...',
    loginRequired: 'Login untuk Menggunakan',
    loginTitle: 'Konversi struk butuh login',
    loginDesc:
      'Login gratis dengan Google untuk menyimpan progres dan hasil konversimu di akun Farisium.',
    signInGoogle: 'Masuk dengan Google',
    limitReached: 'Kamu sudah memakai 5 konversi hari ini. Coba lagi besok.',
    typeError: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.',
    sizeError: 'Ukuran file melebihi batas 10 MB.',
    uploadFailed: 'Gagal mengunggah file ke server. Coba lagi.',
    processFailed: 'Gagal memproses struk. Coba lagi.',
    genericError: 'Terjadi kesalahan. Coba lagi nanti.',
    downloading: 'Menyiapkan file...',
    download: 'Download Excel',
    convertAnother: 'Konversi Struk Lain',
    processingSteps: ['Uploading...', 'AI membaca struk...', 'Memeriksa data...', 'Membuat file Excel...'],
    statusProcessing: 'Sedang memproses struk — biasanya kurang dari 30 detik.',
    notMatching: 'Beberapa angka perlu diperiksa ulang',
    resultTitle: 'Hasil Konversi',
    merchant: 'Toko / Merchant',
    date: 'Tanggal',
    invoiceNo: 'No. Struk',
    currency: 'Mata uang',
    total: 'Total',
    itemsCount: 'Item',
    items: 'Daftar Item',
    noItems: 'Tidak ada item yang terbaca.',
    qty: 'Qty',
    unitPrice: 'Harga Satuan',
    itemTotal: 'Total',
    readData: 'Data yang Terbaca',
    privacy: 'Foto kamu aman di penyimpanan privat dan tidak dibagikan.',
  },
  en: {
    badge: 'AI Agent',
    title: 'Receipt to Excel',
    description:
      'Turn any receipt or transaction photo into a clean Excel file automatically. No manual typing.',
    stepsLabel: '3 quick steps',
    steps: ['Upload receipt photo', 'AI reads & verifies data', 'Download the Excel file'],
    uploadTitle: 'Upload Receipt Photo',
    uploadHint: 'JPG, PNG or WebP — up to 10 MB',
    drop: 'Drag & drop your photo here, or',
    browse: 'Browse files',
    fileAccepted: 'File ready to process',
    changeFile: 'Change file',
    camera: 'Open Camera',
    cameraHint: 'Snap a receipt straight from your phone camera',
    convert: 'Convert to Excel',
    converting: 'Processing...',
    loginRequired: 'Sign in to Continue',
    loginTitle: 'Sign in to convert receipts',
    loginDesc:
      'Free Google sign-in lets you save your progress and results to your Farisium account.',
    signInGoogle: 'Sign in with Google',
    limitReached: 'You have used today’s 5 conversions. Try again tomorrow.',
    typeError: 'Unsupported file type. Use JPG, PNG, or WebP.',
    sizeError: 'File exceeds the 10 MB limit.',
    uploadFailed: 'Failed to upload the file. Please try again.',
    processFailed: 'Failed to process the receipt. Please try again.',
    genericError: 'Something went wrong. Please try again later.',
    downloading: 'Preparing file...',
    download: 'Download Excel',
    convertAnother: 'Convert Another Receipt',
    processingSteps: ['Uploading...', 'AI is reading the receipt...', 'Verifying data...', 'Building the Excel file...'],
    statusProcessing: 'Processing your receipt — usually under 30 seconds.',
    notMatching: 'Some numbers need a second look',
    resultTitle: 'Conversion Result',
    merchant: 'Store / Merchant',
    date: 'Date',
    invoiceNo: 'Receipt No.',
    currency: 'Currency',
    total: 'Total',
    itemsCount: 'Items',
    items: 'Items',
    noItems: 'No items were readable.',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    itemTotal: 'Total',
    readData: 'Extracted Data',
    privacy: 'Your photo is stored in a private bucket and never shared.',
  },
} as const

interface ReceiptItem {
  name: string | null
  quantity: number | null
  unitPrice: number | null
  total: number | null
}

interface Receipt {
  merchantName: string | null
  transactionDate: string | null
  invoiceNumber: string | null
  currency: string | null
  subtotal: number | null
  tax: number | null
  discount: number | null
  grandTotal: number | null
  items: ReceiptItem[]
  needsReview: boolean
  warnings: string[]
}

type PageContent = {
  badge: string
  title: string
  description: string
  stepsLabel: string
  steps: readonly string[]
  uploadTitle: string
  uploadHint: string
  drop: string
  browse: string
  fileAccepted: string
  changeFile: string
  camera: string
  cameraHint: string
  convert: string
  converting: string
  loginRequired: string
  loginTitle: string
  loginDesc: string
  signInGoogle: string
  limitReached: string
  typeError: string
  sizeError: string
  uploadFailed: string
  processFailed: string
  genericError: string
  downloading: string
  download: string
  convertAnother: string
  processingSteps: readonly string[]
  statusProcessing: string
  notMatching: string
  resultTitle: string
  merchant: string
  date: string
  invoiceNo: string
  currency: string
  total: string
  itemsCount: string
  items: string
  noItems: string
  qty: string
  unitPrice: string
  itemTotal: string
  readData: string
  privacy: string
}

export default function ReceiptToExcelPage() {
  const langState = useLangState()
  return (
    <LangContext.Provider value={langState}>
      <ReceiptToExcelContent />
    </LangContext.Provider>
  )
}

function formatAmount(value: number | null | undefined, currency: string | null): string {
  if (value == null) return '-'
  const formatted = value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return currency ? `${currency} ${formatted}` : formatted
}

function ReceiptToExcelContent() {
  const { lang } = useLang()
  const t: PageContent = (pageContent[lang] ?? pageContent.id) as PageContent
  const { user, loading: authLoading, signIn } = useAuthContext()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload')
  const [stepIndex, setStepIndex] = useState(0)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pickFile = useCallback(
    (f: File | undefined | null) => {
      if (!f) return
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError(t.typeError)
        return
      }
      if (f.size > MAX_SIZE) {
        setError(t.sizeError)
        return
      }
      if (f.size <= 0) {
        setError(t.genericError)
        return
      }
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old)
        return URL.createObjectURL(f)
      })
      setFile(f)
      setError(null)
    },
    [t],
  )

  const stopStepTimer = useCallback(() => {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current)
      stepTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (step !== 'processing') return
    stopStepTimer()
    stepTimerRef.current = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, 2))
    }, 2500)
    return stopStepTimer
  }, [step, stopStepTimer])

  useEffect(() => {
    return () => {
      stopStepTimer()
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview, stopStepTimer])

  async function handleConvert() {
    if (!file || !user) return
    setError(null)
    setStepIndex(0)
    setStep('processing')

    try {
      const idToken = await user.getIdToken()

      const presignRes = await fetch('/api/r2/presign-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || 'image/jpeg',
          fileSize: file.size,
        }),
      })
      const presignData = await presignRes.json()
      if (!presignRes.ok) {
        throw new Error(presignData.error || t.uploadFailed)
      }
      const presignJobId: string = presignData.jobId
      setJobId(presignJobId)

      // Direct upload to R2 via presigned PUT.
      setStepIndex(1)
      const putRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'image/jpeg' },
        body: file,
      })
      if (!putRes.ok) {
        throw new Error(t.uploadFailed)
      }

      // Ask the agent to extract + build the Excel.
      setStepIndex(2)
      const processRes = await fetch('/api/agents/receipt-to-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ jobId: presignJobId }),
      })
      const processData = await processRes.json()
      if (!processRes.ok) {
        throw new Error(processData.error || t.processFailed)
      }

      setReceipt(processData.receipt as Receipt)
      setStepIndex(3)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError)
      setStep('upload')
    }
  }

  async function handleDownload() {
    if (!user || !jobId) return
    setDownloading(true)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/r2/presign-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ jobId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.genericError)
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.genericError)
    } finally {
      setDownloading(false)
    }
  }

  function resetAll() {
    stopStepTimer()
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFile(null)
    setReceipt(null)
    setJobId(null)
    setError(null)
    setStep('upload')
    setStepIndex(0)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-frsc-crimson-400" />
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-frsc-crimson-500/[0.04] blur-3xl" />
        <div className="absolute -right-40 top-1/2 h-80 w-80 rounded-full bg-frsc-purple-500/[0.04] blur-3xl" />
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-16 lg:px-6">
        {/* Hero */}
        <section className="text-center">
          <span className="kicker mb-4">
            <span className="kicker-line" aria-hidden="true" />
            {t.badge}
          </span>
          <h1 className="heading-fluid text-h1 text-foreground text-balance">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lead text-frsc-text-200">
            {t.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {t.steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/40 to-frsc-purple-800/30 text-[11px] font-bold text-frsc-crimson-200 ring-1 ring-frsc-crimson-500/30">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-frsc-text-200">{s}</span>
                </div>
                {i < t.steps.length - 1 && (
                  <span className="text-frsc-text-300/40">—</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Auth gate */}
        {!user ? (
          <section className="mx-auto mt-12 max-w-md">
            <GlassCard
              variant="default"
              blur="light"
              withReflection={false}
              withAccent="crimson"
              className="p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/30">
                <ShieldCheck className="h-6 w-6 text-frsc-crimson-400" />
              </div>
              <h2 className="mt-5 font-heading text-xl font-bold text-frsc-white-bright">
                {t.loginTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-frsc-text-200">
                {t.loginDesc}
              </p>
              <button
                type="button"
                onClick={signIn}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-[0.98]"
              >
                <GoogleIcon className="h-5 w-5" />
                {t.signInGoogle}
              </button>
            </GlassCard>
          </section>
        ) : (
          <section className="mt-12">
            {/* ── Upload state ── */}
            {step === 'upload' && (
              <GlassCard
                variant="default"
                blur="light"
                withReflection={false}
                withAccent="crimson"
                className="p-6 sm:p-8"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10">
                    <ReceiptText className="h-5 w-5 text-frsc-crimson-400" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-frsc-white-bright">
                      {t.uploadTitle}
                    </h2>
                    <p className="text-sm text-frsc-text-300">{t.uploadHint}</p>
                  </div>
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0])}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0])}
                />

                {!file ? (
                  <>
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={t.uploadTitle}
                      onClick={() => inputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        pickFile(e.dataTransfer.files?.[0])
                      }}
                      className="group mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-frsc-crimson-500/30 bg-white/[0.02] px-6 py-14 text-center transition-colors hover:border-frsc-crimson-500/60 hover:bg-white/[0.04]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/30 transition-transform group-hover:scale-105">
                        <UploadCloud className="h-6 w-6 text-frsc-crimson-400" />
                      </div>
                      <p className="mt-4 text-sm text-frsc-text-200">
                        {t.drop}{' '}
                        <span className="font-semibold text-frsc-crimson-300 underline-offset-4 group-hover:underline">
                          {t.browse}
                        </span>
                      </p>
                    </div>

                    {/* Camera */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-frsc-text-100 transition-colors hover:border-frsc-crimson-500/40 hover:text-frsc-crimson-200"
                    >
                      <Camera className="h-4 w-4" />
                      {t.camera}
                      <span className="text-xs text-frsc-text-300">· {t.cameraHint}</span>
                    </button>
                  </>
                ) : (
                  <div className="mt-6">
                    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                      {preview ? (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                          <FileImage className="h-6 w-6 text-frsc-text-300" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-frsc-white-bright">
                          {file.name}
                        </p>
                        <p className="text-xs text-frsc-text-300">
                          {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t.fileAccepted}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-frsc-text-200 transition-colors hover:border-frsc-crimson-500/40 hover:text-frsc-crimson-300"
                      >
                        {t.changeFile}
                      </button>
                    </div>

                    <Button
                      variant="default"
                      size="lg"
                      className="mt-5 w-full"
                      onClick={handleConvert}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t.convert}
                    </Button>
                  </div>
                )}

                {error && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}

                <p className="mt-6 flex items-center gap-1.5 text-xs text-frsc-text-300/70">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  {t.privacy}
                </p>
              </GlassCard>
            )}

            {/* ── Processing state ── */}
            {step === 'processing' && (
              <GlassCard
                variant="default"
                blur="light"
                withReflection={false}
                withAccent="crimson"
                className="p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-frsc-crimson-500/20 blur-xl" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-frsc-crimson-500/40 bg-gradient-to-br from-frsc-crimson-800/40 to-frsc-purple-800/30">
                      <Loader2 className="h-6 w-6 animate-spin text-frsc-crimson-300" />
                    </div>
                  </div>
                  <h2 className="mt-5 font-heading text-lg font-bold text-frsc-white-bright">
                    {t.processingSteps[stepIndex]}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm text-frsc-text-300">
                    {t.statusProcessing}
                  </p>

                  <div className="mt-8 flex w-full max-w-sm items-center justify-between">
                    {t.processingSteps.map((label, i) => (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                            i < stepIndex
                              ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                              : i === stepIndex
                                ? 'border-frsc-crimson-500/50 bg-frsc-crimson-500/15 text-frsc-crimson-300'
                                : 'border-white/10 bg-white/[0.02] text-frsc-text-300/50'
                          }`}
                        >
                          {i < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                        </div>
                        <span className="w-20 text-center text-[11px] leading-tight text-frsc-text-300">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* ── Result state ── */}
            {step === 'result' && receipt && (
              <GlassCard
                variant="default"
                blur="light"
                withReflection={false}
                withAccent="crimson"
                className="p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/30">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-frsc-white-bright">
                        {t.resultTitle}
                      </h2>
                      <p className="text-xs text-frsc-text-300">{t.readData}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-frsc-text-200 transition-colors hover:border-frsc-crimson-500/40 hover:text-frsc-crimson-300"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t.changeFile}
                  </button>
                </div>

                {receipt.needsReview && receipt.warnings.length > 0 && (
                  <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                      <AlertTriangle className="h-4 w-4" />
                      {t.notMatching}
                    </p>
                    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-amber-200/90">
                      {receipt.warnings.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.merchant}</p>
                    <p className="mt-1 font-semibold text-frsc-white-bright">
                      {receipt.merchantName ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.date}</p>
                    <p className="mt-1 font-semibold text-frsc-white-bright">
                      {receipt.transactionDate ?? '-'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.invoiceNo}</p>
                    <p className="mt-1 font-semibold text-frsc-white-bright">
                      {receipt.invoiceNumber ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-frsc-crimson-500/20 bg-gradient-to-br from-frsc-crimson-900/20 to-frsc-purple-900/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.total}</p>
                    <p className="mt-1 font-heading text-xl font-bold text-frsc-white-bright">
                      {formatAmount(receipt.grandTotal, receipt.currency)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wide text-frsc-text-300">
                  {t.items}
                </h3>
                {receipt.items.length === 0 ? (
                  <p className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-6 text-center text-sm text-frsc-text-300">
                    {t.noItems}
                  </p>
                ) : (
                  <div className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06]">
                    <table className="w-full min-w-[420px] text-left text-sm">
                      <thead>
                        <tr className="bg-white/[0.04] text-xs uppercase tracking-wide text-frsc-text-300">
                          <th className="px-4 py-2.5 font-medium">{t.items}</th>
                          <th className="px-4 py-2.5 text-right font-medium">{t.qty}</th>
                          <th className="px-4 py-2.5 text-right font-medium">{t.unitPrice}</th>
                          <th className="px-4 py-2.5 text-right font-medium">{t.itemTotal}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {receipt.items.map((item, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2.5 text-frsc-text-100">{item.name ?? '-'}</td>
                            <td className="px-4 py-2.5 text-right text-frsc-text-200">
                              {item.quantity ?? '-'}
                            </td>
                            <td className="px-4 py-2.5 text-right text-frsc-text-200">
                              {formatAmount(item.unitPrice, receipt.currency)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-frsc-white-bright">
                              {formatAmount(item.total, receipt.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {downloading ? t.downloading : t.download}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="flex-1 border border-border"
                    onClick={resetAll}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t.convertAnother}
                  </Button>
                </div>
              </GlassCard>
            )}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}