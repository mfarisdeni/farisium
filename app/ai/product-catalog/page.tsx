'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/ui/GoogleIcon'
import { useAuthContext } from '@/contexts/AuthContext'
import { LangContext, useLangState, useLang } from '@/hooks/useLang'
import { toast } from 'sonner'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react'

import { PRODUCT_CATALOG_FEATURE } from '@/lib/limits'
import {
  MAX_CATALOG_DOCUMENTS,
  MAX_CATALOG_PRODUCTS,
  type CatalogReport,
  type CatalogRow,
  type ProductCatalog,
} from '@/features/product-catalog/schema'
import { mergeCatalogs } from '@/features/product-catalog/merge'
import { CURRENCY_OPTIONS, isCurrencyOption } from '@/features/product-catalog/summary'
import {
  countAdvisoryRows,
  countIncompleteRows,
  validateCatalogRows,
} from '@/features/product-catalog/validation'
import { duplicateRowIds, findPossibleDuplicates } from '@/features/product-catalog/duplicates'

import {
  CatalogUploader,
  makeQueuedImage,
  type QueuedImage,
} from '@/components/catalog/CatalogUploader'
import { CatalogReviewTable } from '@/components/catalog/CatalogReviewTable'
import { CatalogSummaryPanel } from '@/components/catalog/CatalogSummaryPanel'
import { catalogContent, defaultCatalogName } from '@/components/catalog/content'

/** Per-image AI calls run with limited concurrency to stay well inside the
 *  rate limit and keep latency predictable on mobile connections. */
const CONCURRENCY = 2

type Stage = 'upload' | 'processing' | 'review'

export default function ProductCatalogPage() {
  const langState = useLangState()
  return (
    <LangContext.Provider value={langState}>
      <ProductCatalogContent />
    </LangContext.Provider>
  )
}

function ProductCatalogContent() {
  const { lang } = useLang()
  const t = (catalogContent[lang] ?? catalogContent.id) as (typeof catalogContent)['id']
  const { user, loading: authLoading, signIn } = useAuthContext()

  const [catalogName, setCatalogName] = useState(defaultCatalogName)
  const [currency, setCurrency] = useState<string>('IDR')
  const [queue, setQueue] = useState<QueuedImage[]>([])
  const [results, setResults] = useState<Record<string, ProductCatalog>>({})
  const [report, setReport] = useState<CatalogReport | null>(null)
  const [stage, setStage] = useState<Stage>('upload')
  const [doneCount, setDoneCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState<'xlsx' | 'pdf' | null>(null)

  // Object URLs for the queue previews — revoked together on reset/unmount.
  useEffect(() => {
    return () => {
      queue.forEach((entry) => URL.revokeObjectURL(entry.preview))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const issues = useMemo(() => validateCatalogRows(report?.products ?? []), [report])
  const issueMap = useMemo(() => {
    const map = new Map<string, typeof issues[number]['issues']>()
    for (const issue of issues) map.set(issue.id, issue.issues)
    return map
  }, [issues])
  const incompleteCount = countIncompleteRows(issues)
  const advisoryCount = countAdvisoryRows(issues)
  const duplicates = useMemo(() => duplicateRowIds(findPossibleDuplicates(report?.products ?? [])), [report])
  const failedCount = queue.filter((entry) => entry.status === 'failed').length

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setError(null)
    setQueue((current) => {
      const known = new Set(current.map((entry) => `${entry.file.name}:${entry.file.size}`))
      const accepted: QueuedImage[] = []
      for (const file of incoming) {
        const key = `${file.name}:${file.size}`
        if (known.has(key)) continue
        if (current.length + accepted.length >= MAX_CATALOG_DOCUMENTS) break
        known.add(key)
        accepted.push(makeQueuedImage(file, URL.createObjectURL(file)))
      }
      return [...current, ...accepted]
    })
  }, [])

  const removeFile = useCallback((id: string) => {
    setQueue((current) => {
      const target = current.find((entry) => entry.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return current.filter((entry) => entry.id !== id)
    })
  }, [])

  const patchRow = useCallback((id: string, patch: Partial<CatalogRow>) => {
    setReport((current) =>
      current
        ? { ...current, products: current.products.map((row) => (row.id === id ? { ...row, ...patch } : row)) }
        : current,
    )
  }, [])

  const deleteRow = useCallback((id: string) => {
    setReport((current) =>
      current ? { ...current, products: current.products.filter((row) => row.id !== id) } : current,
    )
  }, [])

  const addManualRow = useCallback(() => {
    setReport((current) => {
      if (!current) return current
      if (current.products.length >= MAX_CATALOG_PRODUCTS) {
        setError(t.productsFull)
        return current
      }
      const row: CatalogRow = {
        id: `m_${Date.now().toString(36)}`,
        name: null,
        variant: null,
        sku: null,
        brand: null,
        category: null,
        price: null,
        originalPrice: null,
        discountPercent: null,
        store: null,
        rating: null,
        soldCount: null,
        sourceFile: null,
        sourcePage: null,
        notes: null,
      }
      return { ...current, products: [...current.products, row] }
    })
  }, [t.productsFull])

  /** Upload one image, then ask the agent to read it. Per-image isolation: a
   *  failure marks that one entry as failed and never aborts the batch. */
  const processOne = useCallback(
    async (entry: QueuedImage, idToken: string): Promise<ProductCatalog> => {
      setQueue((current) =>
        current.map((item) => (item.id === entry.id ? { ...item, status: 'uploading' } : item)),
      )

      const presignRes = await fetch('/api/r2/presign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          fileName: entry.file.name,
          contentType: entry.file.type || 'image/jpeg',
          fileSize: entry.file.size,
          feature: PRODUCT_CATALOG_FEATURE,
        }),
      })
      const presignData = await presignRes.json()
      if (!presignRes.ok) throw new Error(presignData.error || t.uploadFailed)
      const jobId: string = presignData.jobId

      const putRes = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': entry.file.type || 'image/jpeg' },
        body: entry.file,
      })
      if (!putRes.ok) throw new Error(t.uploadFailed)

      setQueue((current) =>
        current.map((item) =>
          item.id === entry.id ? { ...item, status: 'processing', jobId } : item,
        ),
      )

      const processRes = await fetch('/api/agents/product-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ jobId }),
      })
      const processData = await processRes.json()
      if (!processRes.ok) throw new Error(processData.error || t.processFailed)

      setQueue((current) =>
        current.map((item) => (item.id === entry.id ? { ...item, status: 'completed' } : item)),
      )
      return processData.catalog as ProductCatalog
    },
    [t.processFailed, t.uploadFailed],
  )

  const runBatch = useCallback(
    async (entries: QueuedImage[], previous: Record<string, ProductCatalog>) => {
      if (!user || entries.length === 0) return
      setError(null)
      setStage('processing')
      setDoneCount(0)

      try {
        const idToken = await user.getIdToken()
        // Keep the pages that were already read: a retry must never discard
        // the products the user did not ask to re-read.
        const collected: Record<string, ProductCatalog> = { ...previous }
        let cursor = 0
        let failureMessage: string | null = null

        const worker = async () => {
          while (cursor < entries.length) {
            const entry = entries[cursor]
            cursor += 1
            try {
              collected[entry.id] = await processOne(entry, idToken)
            } catch (err) {
              const message = err instanceof Error ? err.message : t.processFailed
              failureMessage = message
              setQueue((current) =>
                current.map((item) =>
                  item.id === entry.id ? { ...item, status: 'failed', error: message } : item,
                ),
              )
            } finally {
              setDoneCount((n) => n + 1)
            }
          }
        }

        await Promise.all(
          Array.from({ length: Math.min(CONCURRENCY, entries.length) }, () => worker()),
        )

        const readIds = new Set(Object.keys(collected))
        if (readIds.size === 0) {
          setError(failureMessage ?? t.allFailed)
          setStage('upload')
          return
        }

        // Merge in upload order so the table reads like the screenshots, and
        // so the deterministic row ids stay stable across a retry.
        const ordered = queue
          .filter((entry) => readIds.has(entry.id))
          .map((entry) => collected[entry.id])
        setResults(collected)
        setReport(
          mergeCatalogs({
            catalogName: catalogName.trim() || defaultCatalogName(),
            currency,
            catalogs: ordered,
            failedFiles: queue
              .filter((entry) => !readIds.has(entry.id))
              .map((entry) => entry.file.name),
          }),
        )

        const failed = entries.filter((entry) => !readIds.has(entry.id)).length
        if (failed > 0) toast.warning(`${failed} ${t.failedSome}`)
        setStage('review')
      } catch (err) {
        setError(err instanceof Error ? err.message : t.genericError)
        setStage('upload')
      }
    },
    [catalogName, currency, processOne, queue, t.allFailed, t.failedSome, t.genericError, t.processFailed, user],
  )

  const handleProcess = useCallback(() => {
    const pending = queue.filter((entry) => entry.status !== 'completed')
    if (pending.length === 0) return
    void runBatch(pending, results)
  }, [queue, results, runBatch])

  const discardFailed = useCallback(() => {
    setQueue((current) => {
      current
        .filter((entry) => entry.status === 'failed')
        .forEach((entry) => URL.revokeObjectURL(entry.preview))
      return current.filter((entry) => entry.status !== 'failed')
    })
  }, [])

  const startOver = useCallback(() => {
    queue.forEach((entry) => URL.revokeObjectURL(entry.preview))
    setQueue([])
    setResults({})
    setReport(null)
    setStage('upload')
    setDoneCount(0)
    setError(null)
    setCatalogName(defaultCatalogName())
  }, [queue])

  const handleExport = useCallback(
    async (format: 'xlsx' | 'pdf') => {
      if (!user) return
      if (!report || report.products.length === 0) {
        setError(t.exportEmpty)
        return
      }
      setError(null)
      setExporting(format)

      try {
        const idToken = await user.getIdToken()
        const res = await fetch('/api/agents/product-catalog/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ format, report }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error || t.exportFailed)
        }

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `product-catalog-${new Date().toISOString().slice(0, 10)}.${format}`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      } catch (err) {
        setError(err instanceof Error ? err.message : t.exportFailed)
      } finally {
        setExporting(null)
      }
    },
    [report, t.exportEmpty, t.exportFailed, user],
  )

  const pendingCount = queue.filter((entry) => entry.status === 'ready').length
  const currentIndex = Math.min(doneCount + 1, Math.max(queue.length, 1))

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-frsc-text-300" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-frsc-text-100">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6">
        {/* ── Hero ── */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-frsc-text-200">
            <Sparkles className="h-3 w-3 text-frsc-crimson-600 dark:text-frsc-crimson-400" />
            {t.badge}
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">{t.title}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-frsc-text-200 sm:text-base">{t.description}</p>

          <ol className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-4">
            {t.steps.map((step, index) => (
              <li
                key={step}
                className="rounded-xl border border-border bg-muted px-3 py-2 text-xs text-frsc-text-200"
              >
                <span className="mr-1.5 text-frsc-crimson-600 dark:text-frsc-crimson-400">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {!user ? (
          /* ── Auth gate ── */
          <section className="mt-10">
            <GlassCard className="mx-auto max-w-md p-6 text-center sm:p-8">
              <h2 className="text-lg font-medium">{t.loginTitle}</h2>
              <p className="mt-2 text-sm text-frsc-text-300">{t.loginDesc}</p>
              <Button type="button" onClick={() => void signIn()} className="mt-5 w-full">
                <GoogleIcon className="h-4 w-4" />
                {t.signInGoogle}
              </Button>
              <p className="mt-3 text-xs text-frsc-text-300">{t.loginRequired}</p>
            </GlassCard>
          </section>
        ) : stage === 'upload' ? (
          /* ── Stage 1: settings + upload ── */
          <section className="mt-10 space-y-5">
            <GlassCard className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-frsc-text-300">
                  {t.catalogNameLabel}
                  <input
                    type="text"
                    value={catalogName}
                    onChange={(event) => setCatalogName(event.target.value)}
                    placeholder={t.catalogNamePlaceholder}
                    className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-frsc-text-100 outline-none focus:border-frsc-crimson-500/60"
                  />
                </label>
                <label className="text-xs text-frsc-text-300">
                  {t.currencyLabel}
                  <select
                    value={currency}
                    onChange={(event) => {
                      const next = event.target.value
                      setCurrency(isCurrencyOption(next) ? next : 'IDR')
                    }}
                    className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-frsc-text-100 outline-none focus:border-frsc-crimson-500/60"
                  >
                    {CURRENCY_OPTIONS.map((code) => (
                      <option key={code} value={code} className="bg-card">
                        {code}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[11px] text-frsc-text-300">{t.currencyHint}</span>
                </label>
              </div>
            </GlassCard>

            <GlassCard className="p-5 sm:p-6">
              <h2 className="text-sm font-medium text-frsc-text-100">{t.uploadTitle}</h2>
              <p className="mt-0.5 text-xs text-frsc-text-300">{t.uploadHint}</p>
              <div className="mt-4">
                <CatalogUploader
                  t={t}
                  queue={queue}
                  onAdd={addFiles}
                  onRemove={removeFile}
                  disabled={false}
                />
              </div>

              {error ? (
                <p className="mt-4 text-sm text-amber-400" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="button"
                onClick={handleProcess}
                disabled={pendingCount === 0}
                className="mt-5 w-full"
              >
                <Sparkles className="h-4 w-4" />
                {t.processButton}
              </Button>
            </GlassCard>

            <p className="inline-flex items-start gap-2 text-xs text-frsc-text-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {t.privacy}
            </p>
          </section>
        ) : stage === 'processing' ? (
          /* ── Stage 2: progress ── */
          <section className="mt-10">
            <GlassCard className="p-6 text-center sm:p-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-frsc-crimson-600 dark:text-frsc-crimson-400" />
              <p className="mt-4 text-sm text-frsc-text-100">
                {t.processingOf} {currentIndex} {t.processingOfCount} {queue.length}
              </p>
              <div className="mx-auto mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-frsc-crimson-500 transition-all"
                  style={{ width: `${queue.length > 0 ? (doneCount / queue.length) * 100 : 0}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={queue.length}
                  aria-valuenow={doneCount}
                />
              </div>
              <p className="mt-4 text-xs text-frsc-text-300">{t.processingHint}</p>
            </GlassCard>
          </section>
        ) : report ? (
          /* ── Stage 3: review + export ── */
          <section className="mt-10 space-y-5">
            <CatalogSummaryPanel t={t} report={report} exporting={exporting !== null} />

            {incompleteCount > 0 || advisoryCount > 0 || duplicates.size > 0 ? (
              <GlassCard className="border-amber-500/20 p-4">
                <p className="inline-flex items-start gap-2 text-xs text-amber-400">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    {incompleteCount > 0 ? `${incompleteCount} ${t.needReview}` : ''}
                    {incompleteCount > 0 && (advisoryCount > 0 || duplicates.size > 0) ? ' ' : ''}
                    {duplicates.size > 0 ? `${duplicates.size} ${t.duplicateWarning}` : ''}
                    <span className="mt-1 block text-amber-400/70">{t.duplicateHint}</span>
                  </span>
                </p>
              </GlassCard>
            ) : null}

            <CatalogReviewTable
              t={t}
              rows={report.products}
              issues={issueMap}
              duplicateIds={duplicates}
              shops={report.shops}
              onChange={patchRow}
              onDelete={deleteRow}
              onAddManual={addManualRow}
            />

            {failedCount > 0 ? (
              <GlassCard className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-amber-400">
                    {failedCount} {t.failedFilesTitle} — {t.failedFilesHint}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {queue
                      .filter((entry) => entry.status === 'failed')
                      .map((entry) => (
                        <li key={entry.id} className="truncate text-xs text-frsc-text-300">
                          {entry.file.name}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void runBatch(queue.filter((entry) => entry.status === 'failed'), results)
                    }
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t.retryFailed}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={discardFailed}>
                    <Trash2 className="h-4 w-4" />
                    {t.discardFailed}
                  </Button>
                </div>
              </GlassCard>
            ) : null}

            {error ? (
              <p className="text-sm text-amber-400" role="alert">
                {error}
              </p>
            ) : null}

            <GlassCard className="p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={() => void handleExport('xlsx')}
                  disabled={exporting !== null || report.products.length === 0}
                >
                  {exporting === 'xlsx' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                  )}
                  {exporting === 'xlsx' ? t.exporting : t.exportExcel}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleExport('pdf')}
                  disabled={exporting !== null || report.products.length === 0}
                >
                  {exporting === 'pdf' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {exporting === 'pdf' ? t.exporting : t.exportPdf}
                </Button>
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStage('upload')}
                  disabled={exporting !== null}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.backToUpload}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={startOver}
                  disabled={exporting !== null}
                  className="sm:ml-auto"
                >
                  <Plus className="h-4 w-4" />
                  {t.startOver}
                </Button>
              </div>
            </GlassCard>

            <p className="inline-flex items-center gap-2 text-xs text-frsc-text-300">
              <Package className="h-4 w-4" />
              {t.privacy}
              <CheckCircle2 className="h-3.5 w-3.5" />
              <Download className="h-3.5 w-3.5" />
            </p>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  )
}
