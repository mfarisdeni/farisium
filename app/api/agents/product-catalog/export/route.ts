import { requireAuth } from '@/lib/server-auth'
import { ApiError, errorResponse } from '@/lib/api'
import { catalogReportSchema } from '@/features/product-catalog/schema'
import { buildCatalogWorkbook } from '@/lib/exporters/product-catalog-to-excel'
import { buildCatalogPdf } from '@/lib/exporters/product-catalog-to-pdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const PDF_MIME = 'application/pdf'

/**
 * Export the REVIEWED catalog (client-edited rows), not the raw AI output —
 * that is the whole point of the review screen.
 *
 * The payload is re-validated with the shared Zod contract, then the file is
 * streamed straight back and nothing is ever written to R2: a catalog merges
 * several pages, so there is no single job whose stored output could be the
 * source of truth — the reviewed rows the user approved are.
 */
export async function POST(request: Request) {
  try {
    await requireAuth(request)

    let body: { format?: string; report?: unknown }
    try {
      body = (await request.json()) ?? {}
    } catch {
      return Response.json(
        { error: 'Badan permintaan tidak valid.', code: 'bad_request' },
        { status: 400 },
      )
    }

    const format = body.format === 'pdf' ? 'pdf' : 'xlsx'
    const parsed = catalogReportSchema.safeParse(body.report)

    if (!parsed.success) {
      throw new ApiError('Data katalog tidak valid untuk diekspor.', {
        status: 400,
        code: 'invalid_report',
      })
    }

    if (parsed.data.products.length === 0) {
      throw new ApiError('Katalog masih kosong. Tambahkan minimal satu produk.', {
        status: 400,
        code: 'empty_report',
      })
    }

    const stamp = new Date().toISOString().slice(0, 10)
    const fileName = `product-catalog-${stamp}.${format}`

    if (format === 'pdf') {
      const pdfBuffer = await buildCatalogPdf(parsed.data)
      return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': PDF_MIME,
          'Content-Length': String(pdfBuffer.byteLength),
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    }

    const xlsxBuffer = await buildCatalogWorkbook(parsed.data)
    return new Response(new Uint8Array(xlsxBuffer), {
      status: 200,
      headers: {
        'Content-Type': XLSX_MIME,
        'Content-Length': String(xlsxBuffer.byteLength),
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    return errorResponse(error)
  }
}
