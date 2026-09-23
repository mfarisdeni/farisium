import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import {
  validateUploadInput,
  buildInputR2Key,
  sanitizeFileName,
} from '@/lib/r2/keys'
import { r2PresignedUploadUrl } from '@/lib/r2/client'
import {
  consumeDailyConversionSlot,
  createJob,
  setJobInputKey,
  isKnownFeature,
  RECEIPT_FEATURE,
} from '@/lib/jobs/core'
import { getModel } from '@/lib/ai/gemini'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Phase 1: authenticate → validate → create Firestore job → presign R2 PUT.
 * The client then uploads straight to R2 and calls the processing endpoint.
 */
export async function POST(request: Request) {
  try {
    const uid = await requireAuth(request)

    let body: Record<string, unknown>
    try {
      body = (await request.json()) ?? {}
    } catch {
      return Response.json(
        { error: 'Badan permintaan tidak valid.', code: 'bad_request' },
        { status: 400 },
      )
    }

    const fileName = typeof body.fileName === 'string' ? body.fileName : ''
    const contentType = typeof body.contentType === 'string' ? body.contentType : ''
    const fileSize =
      typeof body.fileSize === 'number' ? body.fileSize : Number(body.fileSize)
    const featureRaw = typeof body.feature === 'string' ? body.feature : ''
    const feature = isKnownFeature(featureRaw) ? featureRaw : RECEIPT_FEATURE

    validateUploadInput({ fileName, contentType, fileSize })

    // Consume one of the daily slots — do this before creating the job so a
    // rejected request never leaves dangling Firestore documents.
    await consumeDailyConversionSlot(uid, feature)

    const originalFileName = sanitizeFileName(fileName)
    const jobId = await createJob(uid, { originalFileName, contentType, model: getModel() }, feature)
    const inputKey = buildInputR2Key(uid, jobId, originalFileName, contentType)
    await setJobInputKey(jobId, inputKey)

    const uploadUrl = await r2PresignedUploadUrl(inputKey, contentType)

    return Response.json(
      { success: true, jobId, uploadUrl, inputKey, expiresIn: 300 },
      { status: 200 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}