import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import { processInvoiceConversion } from '@/features/invoice/processor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120

/**
 * Phase 2+3: process a queued invoice job — download → Gemini → validate →
 * Excel → R2. Synchronous from the client's perspective; failures are
 * persisted on the job.
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

    const result = await processInvoiceConversion(body.jobId, uid)

    return Response.json(
      {
        success: true,
        jobId: result.jobId,
        outputReady: true,
        invoice: result.invoice,
      },
      { status: 200 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}