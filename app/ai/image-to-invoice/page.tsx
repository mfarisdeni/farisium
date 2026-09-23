'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { InvoicePreview } from '@/components/invoice/InvoicePreview'
import { useAuthContext } from '@/contexts/AuthContext'
import { LangContext, useLangState, useLang } from '@/hooks/useLang'
import { toast } from 'sonner'
import {
  FileSpreadsheet,
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
  FileDown,
} from 'lucide-react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

const pageContent = {
  id: {
    badge: 'AI Agent',
    title: 'Foto ke Invoice',
    description:
      'Unggah atau foto invoice, struk, atau tagihan apa pun — AI membaca setiap detail dan menyusun invoice digital dengan template profesional yang minimalis.',
    stepsLabel: '3 langkah cepat',
    steps: ['Upload foto/invoice', 'AI membaca & menyusun', 'Preview lalu download PDF & Excel'],
    uploadTitle: 'Upload Foto Invoice / Struk',
    uploadHint: 'JPG, PNG, atau WebP — maksimal 10 MB',
    drop: 'Seret & letakkan foto di sini, atau',
    browse: 'Pilih file',
    fileAccepted: 'File siap diproses',
    changeFile: 'Ganti file',
    camera: 'Buka Kamera',
    cameraHint: 'Foto invoice langsung dari kamera HP',
    convert: 'Ubah Menjadi Invoice Digital',
    converting: 'Memproses...',
    loginRequired: 'Login untuk Menggunakan',
    loginTitle: 'Buat invoice digital butuh login',
    loginDesc:
      'Login gratis dengan Google untuk menyimpan progres dan hasil konversimu di akun Farisium.',
    signInGoogle: 'Masuk dengan Google',
    limitReached: 'Kamu sudah memakai 5 konversi hari ini. Coba lagi besok.',
    typeError: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.',
    sizeError: 'Ukuran file melebihi batas 10 MB.',
    uploadFailed: 'Gagal mengunggah file ke server. Coba lagi.',
    processFailed: 'Gagal memproses invoice. Coba lagi.',
    genericError: 'Terjadi kesalahan. Coba lagi nanti.',
    downloading: 'Menyiapkan file...',
    downloadExcel: 'Download Excel (Editable)',
    downloadPdf: 'Download PDF',
    excelHint: 'Template profesional — bisa diedit',
    pdfHint: 'Plain, ringan & sesuai preview',
    convertAnother: 'Buat Invoice Lain',
    processingSteps: ['Uploading...', 'AI membaca invoice...', 'Memvalidasi angka...', 'Menyusun template...'],
    statusProcessing: 'Sedang memproses invoice — biasanya kurang dari 30 detik.',
    notMatching: 'Beberapa angka perlu diperiksa ulang',
    resultTitle: 'Preview Invoice Final',
    previewNote: 'Ini template final yang akan kamu download — PDF dibuat persis dari preview ini.',
    seller: 'Dari / Seller',
    buyer: 'Untuk / Buyer',
    no: 'No. Invoice',
    issue: 'Tanggal Terbit',
    due: 'Jatuh Tempo',
    currency: 'Mata uang',
    total: 'Grand Total',
    itemsCount: 'Item',
    readData: 'Data yang Terbaca dari Foto',
    privacy: 'Foto kamu aman di penyimpanan privat dan dihapus otomatis setelah diproses.',
  },
  en: {
    badge: 'AI Agent',
    title: 'Image to Invoice',
    description:
      'Upload or snap any invoice, receipt, or bill — AI reads every detail and builds a professional digital invoice with a clean, minimalist template.',
    stepsLabel: '3 quick steps',
    steps: ['Upload photo / invoice', 'AI reads & structures', 'Preview then download PDF & Excel'],
    uploadTitle: 'Upload Invoice / Receipt Photo',
    uploadHint: 'JPG, PNG or WebP — up to 10 MB',
    drop: 'Drag & drop your photo here, or',
    browse: 'Browse files',
    fileAccepted: 'File ready to process',
    changeFile: 'Change file',
    camera: 'Open Camera',
    cameraHint: 'Snap an invoice straight from your phone camera',
    convert: 'Turn Into a Digital Invoice',
    converting: 'Processing...',
    loginRequired: 'Sign in to Continue',
    loginTitle: 'Sign in to build digital invoices',
    loginDesc:
      'Free Google sign-in lets you save your progress and results to your Farisium account.',
    signInGoogle: 'Sign in with Google',
    limitReached: 'You have used today’s 5 conversions. Try again tomorrow.',
    typeError: 'Unsupported file type. Use JPG, PNG, or WebP.',
    sizeError: 'File exceeds the 10 MB limit.',
    uploadFailed: 'Failed to upload the file. Please try again.',
    processFailed: 'Failed to process the invoice. Please try again.',
    genericError: 'Something went wrong. Please try again later.',
    downloading: 'Preparing file...',
    downloadExcel: 'Download Excel (Editable)',
    downloadPdf: 'Download PDF',
    excelHint: 'Professional template — fully editable',
    pdfHint: 'Plain, light & matches the preview',
    convertAnother: 'Build Another Invoice',
    processingSteps: ['Uploading...', 'AI is reading the invoice...', 'Validating numbers...', 'Building the template...'],
    statusProcessing: 'Processing your invoice — usually under 30 seconds.',
    notMatching: 'Some numbers need a second look',
    resultTitle: 'Final Invoice Preview',
    previewNote: 'This is the final template you will download — the PDF is built exactly from this preview.',
    seller: 'From / Seller',
    buyer: 'To / Buyer',
    no: 'Invoice No.',
    issue: 'Issue Date',
    due: 'Due Date',
    currency: 'Currency',
    total: 'Grand Total',
    itemsCount: 'Items',
    readData: 'Data Extracted from Photo',
    privacy: 'Your photo is stored privately and auto-deleted after processing.',
  },
} as const

interface InvoiceItem {
  name: string | null
  description: string | null
  quantity: number | null
  unitPrice: number | null
  total: number | null
}

interface InvoicePartyRes {
  name: string | null
  address: string | null
  contact: string | null
  taxId: string | null
}

interface Invoice {
  invoiceNumber: string | null
  issueDate: string | null
  dueDate: string | null
  currency: string | null
  seller: InvoicePartyRes
  buyer: InvoicePartyRes
  items: InvoiceItem[]
  subtotal: number | null
  tax: number | null
  taxRate: number | null
  shipping: number | null
  discount: number | null
  grandTotal: number | null
  paymentMethod: string | null
  notes: string | null
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
  downloadExcel: string
  downloadPdf: string
  excelHint: string
  pdfHint: string
  convertAnother: string
  processingSteps: readonly string[]
  statusProcessing: string
  notMatching: string
  resultTitle: string
  previewNote: string
  seller: string
  buyer: string
  no: string
  issue: string
  due: string
  currency: string
  total: string
  itemsCount: string
  readData: string
  privacy: string
}

export default function ImageToInvoicePage() {
  const langState = useLangState()
  return (
    <LangContext.Provider value={langState}>
      <ImageToInvoiceContent />
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

function ImageToInvoiceContent() {
  const { lang } = useLang()
  const t: PageContent = (pageContent[lang] ?? pageContent.id) as PageContent
  const { user, loading: authLoading, signIn } = useAuthContext()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload')
  const [stepIndex, setStepIndex] = useState(0)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<'xlsx' | 'pdf' | null>(null)
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
          feature: 'invoice_from_image',
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

      // Ask the agent to extract + build the invoice.
      setStepIndex(2)
      const processRes = await fetch('/api/agents/image-to-invoice', {
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

      setInvoice(processData.invoice as Invoice)
      setStepIndex(3)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError)
      setStep('upload')
    }
  }

  async function handleDownload(format: 'xlsx' | 'pdf') {
    if (!user || !jobId) return
    setDownloading(format)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/r2/presign-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ jobId, format }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || t.genericError)
      }

      const blob = await res.blob()
      const cd = res.headers.get('Content-Disposition') ?? ''
      const match = cd.match(/filename="?([^";]+)"?/)
      const fileName = match?.[1] ?? (format === 'pdf' ? 'invoice.pdf' : 'invoice.xlsx')

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.genericError)
    } finally {
      setDownloading(null)
    }
  }

  function resetAll() {
    stopStepTimer()
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFile(null)
    setInvoice(null)
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-16 lg:px-6">
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
                    <FileSpreadsheet className="h-5 w-5 text-frsc-crimson-400" />
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

            {/* ── Result state — final preview + download ── */}
            {step === 'result' && invoice && (
              <div className="space-y-5">
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

                {invoice.warnings.length > 0 && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                      <AlertTriangle className="h-4 w-4" />
                      {t.notMatching}
                    </p>
                    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-amber-200/90">
                      {invoice.warnings.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Summary chips */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.no}</p>
                    <p className="mt-1 font-semibold text-frsc-white-bright">
                      {invoice.invoiceNumber ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.issue}</p>
                    <p className="mt-1 font-semibold text-frsc-white-bright">
                      {invoice.issueDate ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.due}</p>
                    <p className="mt-1 font-semibold text-frsc-white-bright">
                      {invoice.dueDate ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-frsc-crimson-500/20 bg-gradient-to-br from-frsc-crimson-900/20 to-frsc-purple-900/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-frsc-text-300">{t.total}</p>
                    <p className="mt-1 font-heading text-xl font-bold text-frsc-white-bright">
                      {formatAmount(invoice.grandTotal, invoice.currency)}
                    </p>
                  </div>
                </div>

                {/* Final template preview (matches the PDF) */}
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-xs text-frsc-text-300">
                    <FileDown className="h-3.5 w-3.5 text-frsc-crimson-400" />
                    {t.previewNote}
                  </p>
                  <InvoicePreview invoice={invoice} lang={lang} />
                </div>

                {/* Download actions */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => handleDownload('xlsx')}
                    disabled={downloading !== null}
                  >
                    {downloading === 'xlsx' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                    )}
                    {downloading === 'xlsx' ? t.downloading : t.downloadExcel}
                    <span className="ml-auto hidden text-xs opacity-70 sm:inline">{t.excelHint}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="border border-border"
                    onClick={() => handleDownload('pdf')}
                    disabled={downloading !== null}
                  >
                    {downloading === 'pdf' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="mr-2 h-4 w-4" />
                    )}
                    {downloading === 'pdf' ? t.downloading : t.downloadPdf}
                    <span className="ml-auto hidden text-xs opacity-70 sm:inline">{t.pdfHint}</span>
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full border border-border"
                  onClick={resetAll}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t.convertAnother}
                </Button>
              </div>
            )}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}