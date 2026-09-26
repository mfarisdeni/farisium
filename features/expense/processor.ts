/**
 * Expense receipt orchestrator: download from R2 → Gemini (two-stage) →
 * validate → normalize category → store on the job.
 *
 * Deliberately does NOT build an Excel/PDF here: the user reviews and edits
 * the rows first, so the export is generated on demand from the reviewed
 * report (see `app/api/agents/expense-report/export`).
 *
 * The extraction path is the receipt pipeline (same transcribe → structure →
 * single-call fallback chain, same deterministic arithmetic validation); only
 * the structured schema and the category step differ.
 */

import { FieldValue } from 'firebase-admin/firestore'
import {
  downloadObjectToBuffer,
  deleteObject,
} from '@/lib/r2/client'
import {
  isAllowedContentType,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/r2/keys'
import { requireOwnedJob, updateJobStatus } from '@/lib/jobs/core'
import { EXPENSE_FEATURE } from '@/lib/limits'
import {
  transcribeReceiptLines,
  structureExpenseFromLines,
  extractExpenseJson,
} from '@/lib/ai/gemini'
import { applyValidation, validateReceiptTotals } from '@/features/receipt/validation'
import { ApiError } from '@/lib/api'
import { normalizeCategory } from './categories.ts'
import {
  buildExpenseStructuredInstruction,
  buildExpenseSystemInstruction,
  buildTranscribeInstruction,
} from './prompt.ts'
import { categoryContext, parseExpenseJson, type ExpenseRecord } from './schema.ts'

export interface ExpenseExtractionResult {
  expense: ExpenseRecord
  jobId: string
}

/** True when the model returned an empty stub instead of real receipt data. */
function isStubExpense(expense: ExpenseRecord): boolean {
  return (
    expense.items.length === 0 &&
    !expense.merchantName &&
    !expense.grandTotal &&
    !expense.subtotal
  )
}

export async function processExpenseReceipt(
  jobId: string,
  uid: string,
): Promise<ExpenseExtractionResult> {
  const job = await requireOwnedJob(jobId, uid)

  if (job.feature !== EXPENSE_FEATURE) {
    throw new ApiError('Fitur tidak dikenal.', { status: 400, code: 'invalid_feature' })
  }

  // Already completed — return the stored result (idempotent, and what makes
  // the review screen safe to reload).
  if (job.status === 'completed' && job.result) {
    return { expense: job.result as ExpenseRecord, jobId }
  }

  if (job.status === 'processing') {
    throw new ApiError('Job sedang diproses. Mohon tunggu sebentar.', {
      status: 409,
      code: 'already_processing',
    })
  }

  if (!job.inputKey) {
    throw new ApiError('File belum diunggah.', { status: 400, code: 'missing_input' })
  }

  await updateJobStatus(jobId, 'processing', {
    startedAt: FieldValue.serverTimestamp(),
  })

  try {
    if (!isAllowedContentType(job.contentType)) {
      throw new ApiError('Tipe file tidak didukung.', {
        status: 400,
        code: 'unsupported_content_type',
      })
    }

    const inputBuffer = await downloadObjectToBuffer(job.inputKey)

    if (inputBuffer.byteLength === 0) {
      throw new ApiError('File kosong atau tidak terbaca.', {
        status: 400,
        code: 'empty_file',
      })
    }

    if (inputBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
      throw new ApiError('Ukuran file melebihi batas 5 MB.', {
        status: 400,
        code: 'file_too_large',
      })
    }

    const base64 = inputBuffer.toString('base64')

    // Stage 1: verbatim transcription (preserves every digit).
    const transcription = await transcribeReceiptLines(
      base64,
      job.contentType,
      buildTranscribeInstruction(),
    )
    let lines: unknown = []
    try {
      lines = JSON.parse(transcription)
    } catch {
      lines = []
    }

    // Stage 2: structure the transcription with the image passed back, so the
    // model can confirm item rows and column order. Empty transcription falls
    // back to a single structured call.
    const hadLines = Array.isArray(lines) && lines.length > 0
    const raw = hadLines
      ? await structureExpenseFromLines(
          lines as string[],
          base64,
          job.contentType,
          buildExpenseStructuredInstruction(),
        )
      : await extractExpenseJson(base64, job.contentType, buildExpenseSystemInstruction())

    let parsed = parseExpenseJson(raw)

    // Quality gate: retry with the single-call image extraction before giving
    // up on a receipt the model clearly could read.
    if (hadLines && isStubExpense(parsed)) {
      parsed = parseExpenseJson(
        await extractExpenseJson(base64, job.contentType, buildExpenseSystemInstruction()),
      )
    }

    // The arithmetic validator is the receipt one (same rules), but it returns
    // a receipt shape — so take only its verdicts and keep the expense fields.
    const verdict = applyValidation(parsed, validateReceiptTotals(parsed))
    const expense: ExpenseRecord = {
      ...parsed,
      needsReview: verdict.needsReview,
      warnings: verdict.warnings,
      category: normalizeCategory(parsed.category, categoryContext(parsed)),
    }

    await updateJobStatus(jobId, 'completed', {
      completedAt: FieldValue.serverTimestamp(),
      result: expense,
    })

    // Temporary-storage policy: the receipt image is no longer needed once
    // extraction succeeds. Delete it immediately (best-effort).
    await deleteObject(job.inputKey).catch(() => {
      /* orphaned object will be ignored; must not fail a successful job */
    })

    return { expense, jobId }
  } catch (error) {
    const safeMessage =
      error instanceof ApiError
        ? error.message
        : 'Gagal memproses struk. Coba lagi beberapa saat.'

    await updateJobStatus(jobId, 'failed', {
      completedAt: FieldValue.serverTimestamp(),
      error: safeMessage,
    }).catch(() => {
      /* status update failure must not mask the original error */
    })

    if (error instanceof ApiError) throw error
    throw new ApiError(safeMessage, { status: 500, code: 'processing_failed' })
  }
}
