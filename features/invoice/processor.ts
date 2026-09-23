/**
 * Invoice conversion orchestrator: download from R2 → Gemini (two-stage) →
 * validate → ExcelJS → upload back to R2 → update job status.
 * The PDF is NOT stored here — it is generated on demand from the job result
 * so it always matches the on-screen preview (see r2/presign-download).
 */

import { FieldValue } from 'firebase-admin/firestore'
import {
  downloadObjectToBuffer,
  uploadBuffer,
  deleteObject,
} from '@/lib/r2/client'
import {
  buildOutputFileKey,
  isAllowedContentType,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/r2/keys'
import { requireOwnedJob, updateJobStatus, INVOICE_FEATURE } from '@/lib/jobs/core'
import {
  transcribeImageLines,
  structureInvoiceFromLines,
} from '@/lib/ai/gemini'
import { buildInvoiceWorkbook } from '@/lib/exporters/invoice-to-excel'
import { parseInvoiceJson, type Invoice } from './schema'
import { validateInvoiceTotals, applyInvoiceValidation } from './validation'
import {
  buildInvoiceTranscribeInstruction,
  buildInvoiceStructuredInstruction,
  buildInvoiceSystemInstruction,
} from './prompt'
import { extractReceiptJson } from '@/lib/ai/gemini'
import { ApiError } from '@/lib/api'

export interface InvoiceConversionResult {
  invoice: Invoice
  outputKey: string
  jobId: string
}

export async function processInvoiceConversion(
  jobId: string,
  uid: string,
): Promise<InvoiceConversionResult> {
  const job = await requireOwnedJob(jobId, uid)

  if (job.feature !== INVOICE_FEATURE) {
    throw new ApiError('Fitur tidak dikenal.', { status: 400, code: 'invalid_feature' })
  }

  // Already completed — return existing result (idempotent).
  if (job.status === 'completed' && job.result && job.outputKey) {
    return { invoice: job.result as Invoice, outputKey: job.outputKey, jobId }
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
      throw new ApiError('Ukuran file melebihi batas 10 MB.', {
        status: 400,
        code: 'file_too_large',
      })
    }

    const base64 = inputBuffer.toString('base64')

    // Stage 1: verbatim transcription (preserves every digit).
    const transcription = await transcribeImageLines(
      base64,
      job.contentType,
      buildInvoiceTranscribeInstruction(),
    )
    let lines: unknown = []
    try {
      lines = JSON.parse(transcription)
    } catch {
      lines = []
    }

    // Stage 2: structure the transcription. Fall back to single-call
    // extraction (receipt-shaped) when the transcription came back empty —
    // it only drives the generic image prompt, then we parse as invoice.
    const raw = Array.isArray(lines) && lines.length > 0
      ? await structureInvoiceFromLines(
          lines as string[],
          '',
          '',
          buildInvoiceStructuredInstruction(),
        )
      : await extractReceiptJson(base64, job.contentType, buildInvoiceSystemInstruction())

    const parsed = parseInvoiceJson(raw)
    const validation = validateInvoiceTotals(parsed)
    const invoice = applyInvoiceValidation(parsed, validation)

    const xlsxBuffer = await buildInvoiceWorkbook(invoice)
    const outputKey = buildOutputFileKey(job.userId, jobId, 'invoice.xlsx')

    await uploadBuffer(outputKey, xlsxBuffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    await updateJobStatus(jobId, 'completed', {
      completedAt: FieldValue.serverTimestamp(),
      outputKey,
      result: invoice,
    })

    // Temporary-storage policy: the attached input file is no longer needed
    // once generation succeeds. Delete it immediately (best-effort).
    if (job.inputKey) {
      await deleteObject(job.inputKey).catch(() => {
        /* orphaned object will be ignored; must not fail a successful job */
      })
    }

    return { invoice, outputKey, jobId }
  } catch (error) {
    const safeMessage =
      error instanceof ApiError
        ? error.message
        : 'Gagal memproses invoice. Coba lagi beberapa saat.'

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