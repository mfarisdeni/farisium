/**
 * Job orchestrator for one catalog page: download from R2 → extract → store
 * the result on the job → delete the uploaded image.
 *
 * The export is deliberately NOT built here. A catalog run merges several pages
 * and the user reviews and edits the merged rows, so the workbook/PDF is
 * generated on demand from the reviewed catalog (see
 * `app/api/agents/product-catalog/export`).
 *
 * The extraction pipeline itself lives in `extract.ts` (pure, testable); this
 * module is only the storage, ownership, and lifecycle half.
 */

import { FieldValue } from 'firebase-admin/firestore'
import {
  downloadObjectToBuffer,
  deleteObject,
} from '@/lib/r2/client'
import { isAllowedContentType, MAX_FILE_SIZE_BYTES } from '@/lib/r2/keys'
import { requireOwnedJob, updateJobStatus } from '@/lib/jobs/core'
import { PRODUCT_CATALOG_FEATURE } from '@/lib/limits'
import { ApiError } from '@/lib/api'
import { extractProductCatalog } from './extract'
import type { ProductCatalog } from './schema'

export interface CatalogExtractionResult {
  catalog: ProductCatalog
  jobId: string
}

export async function processCatalogExtraction(
  jobId: string,
  uid: string,
): Promise<CatalogExtractionResult> {
  const job = await requireOwnedJob(jobId, uid)

  if (job.feature !== PRODUCT_CATALOG_FEATURE) {
    throw new ApiError('Fitur tidak dikenal.', { status: 400, code: 'invalid_feature' })
  }

  // Already completed — return the stored result (idempotent, and what makes
  // the review screen safe to reload).
  if (job.status === 'completed' && job.result) {
    return { catalog: job.result as ProductCatalog, jobId }
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

    const extracted = await extractProductCatalog({
      base64: inputBuffer.toString('base64'),
      mimeType: job.contentType,
      fileName: job.originalFileName,
    })

    // Every row already carries the file it came from (annotated by the
    // pipeline), so a row in the review table can always be traced back to the
    // screenshot the user uploaded.
    await updateJobStatus(jobId, 'completed', {
      completedAt: FieldValue.serverTimestamp(),
      result: extracted,
    })

    // Temporary-storage policy: the catalog image is no longer needed once
    // extraction succeeds. Delete it immediately (best-effort).
    await deleteObject(job.inputKey).catch(() => {
      /* orphaned object will be ignored; must not fail a successful job */
    })

    return { catalog: extracted, jobId }
  } catch (error) {
    const safeMessage =
      error instanceof ApiError
        ? error.message
        : 'Gagal memproses katalog. Coba lagi beberapa saat.'

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
