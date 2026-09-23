import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import { downloadObjectToBuffer, deleteObject } from '@/lib/r2/client'
import { requireOwnedJob } from '@/lib/jobs/core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

/**
 * Temporary-storage download: streams the completed Excel back as an
 * attachment and ALWAYS deletes the stored file right after it has been
 * read — the job result survives in Firestore, but no file lingers in R2.
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

    const buffer = await downloadObjectToBuffer(job.outputKey)
    const fileName = `receipt-${job.id}.xlsx`

    // Delete immediately after reading. Download is fire-and-forget on the
    // client side, so the object must be removed server-side right here.
    await deleteObject(job.outputKey).catch(() => {
      /* best-effort; a failed delete must not block the download */
    })

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': XLSX_MIME,
        'Content-Length': String(buffer.byteLength),
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}