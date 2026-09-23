import { requireAuth } from '@/lib/server-auth'
import { errorResponse } from '@/lib/api'
import { downloadObjectToBuffer, deleteObject } from '@/lib/r2/client'
import { requireOwnedJob, INVOICE_FEATURE } from '@/lib/jobs/core'
import { buildInvoicePdf } from '@/lib/exporters/invoice-to-pdf'
import type { Invoice } from '@/features/invoice/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const PDF_MIME = 'application/pdf'

/**
 * Temporary-storage download:
 * - format=xlsx (default): streams the completed Excel back as an attachment
 *   and ALWAYS deletes the stored file right after it has been read — the
 *   result survives in Firestore, but no file lingers in R2.
 * - format=pdf: the PDF is generated on demand from the saved job result (no
 *   R2 object involved), so it always matches the on-screen preview exactly.
 */
export async function POST(request: Request) {
  try {
    const uid = await requireAuth(request)

    let body: { jobId?: string; format?: string }
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

    if (job.status !== 'completed' || !job.result) {
      return Response.json(
        { error: 'Hasil belum tersedia untuk diunduh.', code: 'output_not_ready' },
        { status: 409 },
      )
    }

    const format = body.format === 'pdf' ? 'pdf' : 'xlsx'

    if (format === 'pdf') {
      if (job.feature !== INVOICE_FEATURE) {
        return Response.json(
          { error: 'PDF tidak tersedia untuk job ini.', code: 'invalid_format' },
          { status: 400 },
        )
      }
      const pdfBuffer = await buildInvoicePdf(job.result as Invoice)
      return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': PDF_MIME,
          'Content-Length': String(pdfBuffer.byteLength),
          'Content-Disposition': `attachment; filename="invoice-${job.id}.pdf"`,
        },
      })
    }

    if (!job.outputKey) {
      return Response.json(
        { error: 'Excel belum tersedia untuk diunduh.', code: 'output_not_ready' },
        { status: 409 },
      )
    }

    const buffer = await downloadObjectToBuffer(job.outputKey)
    const fileName = job.feature === INVOICE_FEATURE ? `invoice-${job.id}.xlsx` : `receipt-${job.id}.xlsx`

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