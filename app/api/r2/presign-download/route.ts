import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import { r2PresignedDownloadUrl } from '@/lib/r2/client'
import { requireOwnedJob } from '@/lib/jobs/core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Phase 3b: presign a GET URL for the completed Excel output.
 * Ownership is checked server-side — a user can only download their own job.
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

    const job = await requireOwnedJob(body.jobId, uid)

    if (job.status !== 'completed' || !job.outputKey) {
      return Response.json(
        { error: 'Excel belum tersedia untuk diunduh.', code: 'output_not_ready' },
        { status: 409 },
      )
    }

    const downloadUrl = await r2PresignedDownloadUrl(job.outputKey)

    return Response.json(
      {
        success: true,
        downloadUrl,
        expiresIn: 300,
      },
      { status: 200 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}