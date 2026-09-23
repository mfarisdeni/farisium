/**
 * R2 key builders + upload validation.
 * Pure module — no SDK import. Server-side only; keys are never built on the client.
 */

import { ApiError } from '../api.ts'

export const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export const OUTPUT_SHEET_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const CONTENT_TYPE_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function isAllowedContentType(contentType: string): boolean {
  return (ALLOWED_CONTENT_TYPES as readonly string[]).includes(contentType)
}

/** Strip path separators, control characters, and path-traversal sequences. */
export function sanitizeFileName(fileName: string): string {
  const base = (fileName || '').split(/[\\/]/).pop() ?? ''
  const cleaned = base
    .replace(/[^\w.\-() ]/g, '')
    .replace(/^\.+/, '')
    .replace(/\.{2,}/g, '.')
    .slice(0, 80)
  return cleaned || 'file'
}

function stripKnownExtension(base: string): string {
  return base.replace(/\.[a-zA-Z0-9]{1,5}$/, '')
}

/**
 * Input key is derived from the server-validated content type, so a spoofed
 * extension can never smuggle a non-image object into the bucket.
 */
export function buildInputR2Key(
  uid: string,
  jobId: string,
  fileName: string,
  contentType: string,
): string {
  const ext = CONTENT_TYPE_EXT[contentType] ?? 'bin'
  const safe = `${stripKnownExtension(sanitizeFileName(fileName))}.${ext}`
  return `users/${uid}/jobs/${jobId}/input/${safe}`
}

export function buildOutputR2Key(uid: string, jobId: string): string {
  return `users/${uid}/jobs/${jobId}/output/receipt.xlsx`
}

/** Generic output file key (e.g. `users/{uid}/jobs/{jobId}/output/invoice.xlsx`). */
export function buildOutputFileKey(uid: string, jobId: string, fileName: string): string {
  const safe = sanitizeFileName(fileName)
  return `users/${uid}/jobs/${jobId}/output/${safe}`
}

export interface UploadInput {
  fileName: string
  contentType: string
  fileSize: number
}

export function validateUploadInput(input: UploadInput): void {
  if (!input) {
    throw new ApiError('Permintaan tidak valid.', { status: 400, code: 'bad_request' })
  }

  const { fileName, contentType, fileSize } = input

  if (typeof fileName !== 'string' || fileName.trim().length === 0) {
    throw new ApiError('Nama file wajib diisi.', {
      status: 400,
      code: 'invalid_file_name',
    })
  }

  if (typeof contentType !== 'string' || !isAllowedContentType(contentType)) {
    throw new ApiError('Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.', {
      status: 400,
      code: 'unsupported_content_type',
    })
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new ApiError('Ukuran file tidak valid.', {
      status: 400,
      code: 'invalid_file_size',
    })
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    throw new ApiError('Ukuran file maksimal 10 MB.', {
      status: 400,
      code: 'file_too_large',
    })
  }
}