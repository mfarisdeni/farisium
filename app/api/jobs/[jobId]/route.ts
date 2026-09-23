import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import { getReceiptJob } from '@/features/receipt/processor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET a job by id (owner only). Used for resuming / polling a conversion. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const uid = await requireAuth(_request)
    const { jobId } = await params

    const job = await getReceiptJob(jobId, uid)

    return Response.json(
      {
        success: true,
        job: {
          id: job.id,
          status: job.status,
          originalFileName: job.originalFileName,
          contentType: job.contentType,
          model: job.model,
          result: job.result,
          error: job.error,
          createdAt: job.createdAt,
          completedAt: job.completedAt,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}