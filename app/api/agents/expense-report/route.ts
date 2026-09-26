import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import { processExpenseReceipt } from '@/features/expense/processor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * Phase 3: extract ONE receipt of a report — download from R2 → Gemini →
 * validate → store on the job. The client calls this once per receipt
 * (limited concurrency) and keeps every successful result, so one failure
 * never discards the rest of the report.
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

    const result = await processExpenseReceipt(body.jobId, uid)

    return Response.json(
      {
        success: true,
        jobId: result.jobId,
        expense: result.expense,
      },
      { status: 200 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}
