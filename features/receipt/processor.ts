/**
 * Receipt conversion orchestrator: download from R2 → Gemini → validate →
 * ExcelJS → upload back to R2 → update job status.
 */

import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/firebase-admin'
import {
  downloadObjectToBuffer,
  uploadBuffer,
  deleteObject,
} from '@/lib/r2/client'
import {
  buildOutputR2Key,
  isAllowedContentType,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/r2/keys'
import { requireOwnedJob, updateJobStatus, RECEIPT_FEATURE, type JobRecord } from '@/lib/jobs/core'
import {
  transcribeReceiptLines,
  structureReceiptFromLines,
  extractReceiptJson,
} from '@/lib/ai/gemini'
import { buildReceiptWorkbook } from '@/lib/exporters/receipt-to-excel'
import { parseReceiptJson, type Receipt } from './schema'
import { validateReceiptTotals, applyValidation } from './validation'
import {
  buildTranscribeInstruction,
  buildStructuredInstruction,
  buildSystemInstruction,
} from './prompt'
import { ApiError } from '@/lib/api'

export interface ReceiptConversionResult {
  receipt: Receipt
  outputKey: string
  jobId: string
}

export async function processReceiptConversion(
  jobId: string,
  uid: string,
): Promise<ReceiptConversionResult> {
  const job = await requireOwnedJob(jobId, uid)

  if (job.feature !== RECEIPT_FEATURE) {
    throw new ApiError('Fitur tidak dikenal.', { status: 400, code: 'invalid_feature' })
  }

  // Already completed — return existing result (idempotent).
  if (job.status === 'completed' && job.result && job.outputKey) {
    return { receipt: job.result as Receipt, outputKey: job.outputKey, jobId }
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

    // Stage 2: structure the transcription (text-only — forcing the model to
    // reason from the exact transcript is far more accurate than re-OCR-ing the
    // photo again). Fall back to single-call when transcription was empty.
    const raw = Array.isArray(lines) && lines.length > 0
      ? await structureReceiptFromLines(
          lines as string[],
          '',
          '',
          buildStructuredInstruction(),
        )
      : await extractReceiptJson(base64, job.contentType, buildSystemInstruction())

    const parsed = parseReceiptJson(raw)
    const validation = validateReceiptTotals(parsed)
    const receipt = applyValidation(parsed, validation)

    const xlsxBuffer = await buildReceiptWorkbook(receipt)
    const outputKey = buildOutputR2Key(job.userId, jobId)

    await uploadBuffer(outputKey, xlsxBuffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    await updateJobStatus(jobId, 'completed', {
      completedAt: FieldValue.serverTimestamp(),
      outputKey,
      result: receipt,
    })

    // Temporary-storage policy: the attached input file is no longer needed
    // once generation succeeds. Delete it immediately (best-effort).
    if (job.inputKey) {
      await deleteObject(job.inputKey).catch(() => {
        /* orphaned object will be ignored; must not fail a successful job */
      })
    }

    return { receipt, outputKey, jobId }
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

export async function getReceiptJob(jobId: string, uid: string): Promise<JobRecord> {
  const job = await requireOwnedJob(jobId, uid)
  if (job.feature !== RECEIPT_FEATURE) {
    throw new ApiError('Fitur tidak dikenal.', { status: 400, code: 'invalid_feature' })
  }
  return job
}