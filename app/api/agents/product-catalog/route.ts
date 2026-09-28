import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import { processCatalogExtraction } from '@/features/product-catalog/processor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * Extract ONE catalog page — download from R2 → Gemini → validate → store on
 * the job. The client calls this once per uploaded image (limited concurrency)
 * and merges the results itself, so one unreadable screenshot never discards
 * the pages that were read successfully.
 */
export async function POST(request: Request) {
  try {
    const uid = await requireAuth(request)

    let body: { jobId?: string }
    try {
      body = (await request.json()) ?? {}
    } catch {
      return Response.json(
        { error: 'Badan permintaan tidak valid.', code: 'bad_request' },
        { status: 400 },
      )
    }

    if (!body.jobId || typeof body.jobId !== 'string') {
      return Response.json(
        { error: 'Parameter jobId wajib diisi.', code: 'bad_request' },
        { status: 400 },
      )
    }

    const result = await processCatalogExtraction(body.jobId, uid)

    return Response.json(
      {
        success: true,
        jobId: result.jobId,
        catalog: result.catalog,
      },
      { status: 200 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}
