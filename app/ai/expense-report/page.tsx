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
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wallet,
} from 'lucide-react'

import {
  MAX_REPORT_ITEMS,
  toExpenseRow,
  type ExpenseRow,
} from '@/features/expense/schema'
import {
  CURRENCY_OPTIONS,
  buildExpenseSummary,
  isCurrencyOption,
} from '@/features/expense/summary'
import { duplicateRowIds, findPossibleDuplicates } from '@/features/expense/duplicates'
import { countIncompleteRows, validateExpenseRows } from '@/features/expense/validation'

import {
  ExpenseUploader,
  makeQueuedReceipt,
  type QueuedReceipt,
} from '@/components/expense/ExpenseUploader'
import { ExpenseReviewTable } from '@/components/expense/ExpenseReviewTable'
import { ExpenseSummaryPanel } from '@/components/expense/ExpenseSummaryPanel'
import { defaultReportName, expenseContent } from '@/components/expense/content'

/** Per-receipt AI calls run with limited concurrency to stay well inside the
 *  rate limit and keep latency predictable on mobile connections. */
const CONCURRENCY = 2

/**
 * Feature key for the job + daily rate limit. Duplicated as a literal on
 * purpose: `lib/jobs/core.ts` pulls in firebase-admin and is server-only, so
 * it can never be imported from a client component. Keep in sync with
 * `EXPENSE_FEATURE` in `lib/jobs/core.ts`.
 */
const EXPENSE_FEATURE = 'expense_report'

type Stage = 'upload' | 'processing' | 'review'

export default function ExpenseReportPage() {
  const langState = useLangState()
  return (
    <LangContext.Provider value={langState}>
      <ExpenseReportContent />
    </LangContext.Provider>
  )
}

function ExpenseReportContent() {
  const { lang } = useLang()
  const t = (expenseContent[lang] ?? expenseContent.id) as (typeof expenseContent)['id']
  const { user, loading: authLoading, signIn } = useAuthContext()

  const [reportName, setReportName] = useState(defaultReportName)
  const [currency, setCurrency] = useState<string>('IDR')
  const [queue, setQueue] = useState<QueuedReceipt[]>([])
  const [rows, setRows] = useState<ExpenseRow[]>([])
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

  const summary = useMemo(
    () => buildExpenseSummary({ reportName, currency, expenses: rows }),
    [reportName, currency, rows],
  )

  const issues = useMemo(() => validateExpenseRows(rows), [rows])
  const reviewIds = useMemo(() => {
    const ids = new Set<string>()
    for (const issue of issues) {
      if (issue.missing.includes('date') || issue.missing.includes('merchant') || issue.missing.includes('total')) {
        ids.add(issue.id)
      }
    }
    return ids
  }, [issues])

  const duplicateIds = useMemo(
    () => duplicateRowIds(findPossibleDuplicates(rows)),
    [rows],
  )

  const incompleteCount = countIncompleteRows(issues)
  const failedCount = queue.filter((entry) => entry.status === 'failed').length

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setError(null)
    setQueue((current) => {
      const known = new Set(current.map((entry) => `${entry.file.name}:${entry.file.size}`))
      const accepted: QueuedReceipt[] = []
      for (const file of incoming) {
        const key = `${file.name}:${file.size}`
        if (known.has(key)) continue
        if (current.length + accepted.length >= MAX_REPORT_ITEMS) break
        known.add(key)
        accepted.push(makeQueuedReceipt(file, URL.createObjectURL(file)))
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

  const patchRow = useCallback((id: string, patch: Partial<ExpenseRow>) => {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row
        // Any manual edit means the warnings from extraction are resolved.
        return { ...row, ...patch, needsReview: false, warnings: [] }
      }),
    )
  }, [])

  const deleteRow = useCallback((id: string) => {
    setRows((current) => current.filter((row) => row.id !== id))
  }, [])

  const addManualRow = useCallback(() => {
    if (rows.length >= MAX_REPORT_ITEMS) {
      setError(t.limitReached)
      return
    }
    setRows((current) => [
      ...current,
      {
        id: `m_${Date.now().toString(36)}`,
        merchantName: null,
        transactionDate: null,
        invoiceNumber: null,
        currency,
        paymentMethod: null,
        category: 'other',
        notes: null,
        subtotal: null,
        tax: null,
        discount: null,
        grandTotal: null,
        items: [],
        needsReview: false,
        warnings: [],
      },
    ])
  }, [currency, rows.length, t.limitReached])

  /** Upload one file, then ask the agent to extract it. Per-receipt isolation:
   *  a failure marks that one entry as failed and never aborts the batch. */
  const processOne = useCallback(
    async (entry: QueuedReceipt, idToken: string): Promise<ExpenseRow | null> => {
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
          feature: EXPENSE_FEATURE,
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

      const processRes = await fetch('/api/agents/expense-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ jobId }),
      })
      const processData = await processRes.json()
      if (!processRes.ok) throw new Error(processData.error || t.processFailed)

      setQueue((current) =>
        current.map((item) => (item.id === entry.id ? { ...item, status: 'completed' } : item)),
      )
      return toExpenseRow(processData.expense as Parameters<typeof toExpenseRow>[0], entry.id)
    },
    [t.processFailed, t.uploadFailed],
  )

  const runBatch = useCallback(
    async (entries: QueuedReceipt[]) => {
      if (!user || entries.length === 0) return
      setError(null)
      setStage('processing')
      setDoneCount(0)

      try {
        const idToken = await user.getIdToken()
        const collected: ExpenseRow[] = []
        let cursor = 0
        let failureMessage: string | null = null

        const worker = async () => {
          while (cursor < entries.length) {
            const entry = entries[cursor]
            cursor += 1
            try {
              const row = await processOne(entry, idToken)
              if (row) {
                collected.push(row)
                setRows((current) => [...current, row])
              }
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

        if (collected.length === 0) {
          setError(failureMessage ?? t.allFailed)
          setStage('upload')
          return
        }

        const failed = entries.length - collected.length
        if (failed > 0) toast.warning(`${failed} ${t.failedSome}`)
        setStage('review')
      } catch (err) {
        setError(err instanceof Error ? err.message : t.genericError)
        setStage('upload')
      }
    },
    [processOne, t.allFailed, t.failedSome, t.genericError, t.processFailed, user],
  )

  const handleProcess = useCallback(() => {
    const pending = queue.filter((entry) => entry.status !== 'completed')
    if (pending.length === 0) return
    void runBatch(pending)
  }, [queue, runBatch])

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
    setRows([])
    setStage('upload')
    setDoneCount(0)
    setError(null)
    setReportName(defaultReportName())
  }, [queue])

  const handleExport = useCallback(
    async (format: 'xlsx' | 'pdf') => {
      if (!user) return
      if (rows.length === 0) {
        setError(t.exportEmpty)
        return
      }
      setError(null)
      setExporting(format)

      try {
        const idToken = await user.getIdToken()
        const res = await fetch('/api/agents/expense-report/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({
            format,
            report: { reportName, currency, expenses: rows },
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error || t.exportFailed)
        }

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `expense-report-${new Date().toISOString().slice(0, 10)}.${format}`
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
    [currency, reportName, rows, t.exportEmpty, t.exportFailed, user],
  )

  const pendingCount = queue.filter((entry) => entry.status === 'ready').length
  const currentIndex = Math.min(doneCount + 1, Math.max(queue.length, 1))

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6">
        {/* ── Hero ── */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
            <Sparkles className="h-3 w-3 text-crimson" />
            {t.badge}
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">{t.title}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/55 sm:text-base">{t.description}</p>

          <ol className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-4">
            {t.steps.map((step, index) => (
              <li
                key={step}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/55"
              >
                <span className="mr-1.5 text-crimson">{index + 1}</span>
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
              <p className="mt-2 text-sm text-white/50">{t.loginDesc}</p>
              <Button type="button" onClick={() => void signIn()} className="mt-5 w-full">
                <GoogleIcon className="h-4 w-4" />
                {t.signInGoogle}
              </Button>
              <p className="mt-3 text-xs text-white/35">{t.loginRequired}</p>
            </GlassCard>
          </section>
        ) : stage === 'upload' ? (
          /* ── Stage 1: settings + upload ── */
          <section className="mt-10 space-y-5">
            <GlassCard className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-white/50">
                  {t.reportNameLabel}
                  <input
                    type="text"
                    value={reportName}
                    onChange={(event) => setReportName(event.target.value)}
                    placeholder={t.reportNamePlaceholder}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-crimson/60"
                  />
                </label>
                <label className="text-xs text-white/50">
                  {t.currencyLabel}
                  <select
                    value={currency}
                    onChange={(event) => {
                      const next = event.target.value
                      setCurrency(isCurrencyOption(next) ? next : 'IDR')
                    }}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-crimson/60"
                  >
                    {CURRENCY_OPTIONS.map((code) => (
                      <option key={code} value={code} className="bg-[#0d0d12]">
                        {code}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-[11px] text-white/35">{t.currencyHint}</span>
                </label>
              </div>
            </GlassCard>

            <GlassCard className="p-5 sm:p-6">
              <h2 className="text-sm font-medium text-white/85">{t.uploadTitle}</h2>
              <p className="mt-0.5 text-xs text-white/40">{t.uploadHint}</p>
              <div className="mt-4">
                <ExpenseUploader
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

            <p className="inline-flex items-start gap-2 text-xs text-white/35">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {t.privacy}
            </p>
          </section>
        ) : stage === 'processing' ? (
          /* ── Stage 2: progress ── */
          <section className="mt-10">
            <GlassCard className="p-6 text-center sm:p-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-crimson" />
              <p className="mt-4 text-sm text-white/80">
                {t.processingOf} {currentIndex} {t.processingOfCount} {queue.length}
              </p>
              <div className="mx-auto mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-crimson transition-all"
                  style={{ width: `${queue.length > 0 ? (doneCount / queue.length) * 100 : 0}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={queue.length}
                  aria-valuenow={doneCount}
                />
              </div>
              <p className="mt-4 text-xs text-white/40">{t.processingHint}</p>
            </GlassCard>
          </section>
        ) : (
          /* ── Stage 3: review + export ── */
          <section className="mt-10 space-y-5">
            <ExpenseSummaryPanel t={t} lang={lang} summary={summary} exporting={exporting !== null} />

            {incompleteCount > 0 || duplicateIds.size > 0 ? (
              <GlassCard className="border-amber-500/20 p-4">
                <p className="inline-flex items-start gap-2 text-xs text-amber-400">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    {incompleteCount > 0 ? `${incompleteCount} ${t.needReview}` : ''}
                    {incompleteCount > 0 && duplicateIds.size > 0 ? ' ' : ''}
                    {duplicateIds.size > 0 ? `${duplicateIds.size} ${t.duplicateWarning}` : ''}
                    <span className="mt-1 block text-amber-400/70">{t.duplicateHint}</span>
                  </span>
                </p>
              </GlassCard>
            ) : null}

            <ExpenseReviewTable
              t={t}
              lang={lang}
              rows={rows}
              reviewIds={reviewIds}
              duplicateIds={duplicateIds}
              onChange={patchRow}
              onDelete={deleteRow}
              onAddManual={addManualRow}
            />

            {failedCount > 0 ? (
              <GlassCard className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-amber-400">
                  {failedCount} {t.failedSome}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void runBatch(queue.filter((entry) => entry.status === 'failed'))
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
                  disabled={exporting !== null || rows.length === 0}
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
                  disabled={exporting !== null || rows.length === 0}
                >
                  {exporting === 'pdf' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {exporting === 'pdf' ? t.exporting : t.exportPdf}
                </Button>
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4 sm:flex-row">
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

            <p className="inline-flex items-center gap-2 text-xs text-white/35">
              <Wallet className="h-4 w-4" />
              {t.privacy}
              <CheckCircle2 className="h-3.5 w-3.5" />
              <Download className="h-3.5 w-3.5" />
            </p>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
