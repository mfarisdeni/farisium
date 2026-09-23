'use client'

import { AlertTriangle } from 'lucide-react'
import type { Invoice } from '@/features/invoice/schema'
import type { Lang } from '@/lib/translations'

/**
 * On-screen preview of the final invoice template. It uses the same design
 * tokens as the generated PDF (white sheet, ink text, crimson accent bar,
 * seller left / INVOICE right, buyer block, items table, right-aligned
 * totals), so what you preview is exactly what you download.
 */

interface Props {
  invoice: Invoice
  lang?: Lang
}

function fmt(value: number | null | undefined): string {
  if (value == null) return '-'
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function money(value: number | null | undefined, currency: string | null | undefined): string {
  if (value == null) return '-'
  return currency ? `${currency} ${fmt(value)}` : fmt(value)
}

export function InvoicePreview({ invoice, lang = 'id' }: Props) {
  const l = {
    id: {
      invoice: 'INVOICE',
      no: 'No. Invoice',
      issue: 'Tanggal Terbit',
      due: 'Jatuh Tempo',
      currency: 'Mata Uang',
      from: 'DARI / FROM',
      to: 'UNTUK / TO',
      name: 'Nama',
      address: 'Alamat',
      contact: 'Kontak',
      taxId: 'NPWP / Tax ID',
      item: 'ITEM',
      qty: 'QTY',
      unit: 'HARGA SATUAN',
      total: 'TOTAL',
      subtotal: 'Subtotal',
      tax: 'Pajak',
      shipping: 'Ongkir',
      discount: 'Diskon',
      grandTotal: 'GRAND TOTAL',
      payment: 'PEMBAYARAN / PAYMENT',
      notes: 'CATATAN / NOTES',
      noItems: 'Tidak ada item yang terbaca.',
      needsReview: 'Perlu Review',
    },
    en: {
      invoice: 'INVOICE',
      no: 'Invoice No.',
      issue: 'Issue Date',
      due: 'Due Date',
      currency: 'Currency',
      from: 'FROM',
      to: 'TO',
      name: 'Name',
      address: 'Address',
      contact: 'Contact',
      taxId: 'Tax ID',
      item: 'ITEM',
      qty: 'QTY',
      unit: 'UNIT PRICE',
      total: 'TOTAL',
      subtotal: 'Subtotal',
      tax: 'Tax',
      shipping: 'Shipping',
      discount: 'Discount',
      grandTotal: 'GRAND TOTAL',
      payment: 'PAYMENT',
      notes: 'NOTES',
      noItems: 'No items were readable.',
      needsReview: 'Needs Review',
    },
  } as const
  const t = l[lang] ?? l.id

  const seller = invoice.seller ?? {}
  const buyer = invoice.buyer ?? {}

  const props = { name: t.name, address: t.address, contact: t.contact }

  return (
    <div className="overflow-hidden rounded-2xl border border-frsc-text-300/20 bg-white text-zinc-900 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
      {/* Top accent bar */}
      <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-frsc-crimson-600 via-frsc-crimson-500 to-frsc-purple-600" />

      <div className="px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold">{seller.name ?? buyer.name ?? 'Farisium'}</h3>
            {seller.address && <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-zinc-500">{seller.address}</p>}
            {seller.taxId && <p className="mt-1 text-xs text-zinc-500">{t.taxId}: {seller.taxId}</p>}
            {seller.contact && <p className="mt-1 text-xs text-zinc-500">{seller.contact}</p>}
          </div>
          <div className="sm:text-right">
            <p className="font-heading text-2xl font-bold tracking-tight">{t.invoice}</p>
            <dl className="mt-3 space-y-1 text-xs">
              <div><dt className="inline font-medium text-zinc-500">{t.no}: </dt><dd className="inline font-semibold">{invoice.invoiceNumber ?? '-'}</dd></div>
              <div><dt className="inline font-medium text-zinc-500">{t.issue}: </dt><dd className="inline">{invoice.issueDate ?? '-'}</dd></div>
              <div><dt className="inline font-medium text-zinc-500">{t.due}: </dt><dd className="inline">{invoice.dueDate ?? '-'}</dd></div>
              <div><dt className="inline font-medium text-zinc-500">{t.currency}: </dt><dd className="inline">{invoice.currency ?? '-'}</dd></div>
            </dl>
          </div>
        </div>

        {/* Buyer */}
        <div className="mt-8 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
          <p className="text-[11px] font-bold tracking-wide text-frsc-crimson-600">{t.to}</p>
          <div className="mt-2 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
            <div><span className="font-medium text-zinc-500">{props.name}: </span>{buyer.name ?? '-'}</div>
            {buyer.address && <div><span className="font-medium text-zinc-500">{props.address}: </span>{buyer.address}</div>}
            {buyer.contact && <div><span className="font-medium text-zinc-500">{props.contact}: </span>{buyer.contact}</div>}
          </div>
        </div>

        {/* Items table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[460px] text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-300 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="py-2 font-semibold">{t.item}</th>
                <th className="py-2 font-semibold">{t.qty}</th>
                <th className="py-2 text-right font-semibold">{t.unit}</th>
                <th className="py-2 text-right font-semibold">{t.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {invoice.items.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-center text-zinc-400">{t.noItems}</td></tr>
              ) : (
                invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-medium text-zinc-800">{item.name ?? item.description ?? '-'}</td>
                    <td className="py-2.5 text-zinc-600">{item.quantity ?? '-'}</td>
                    <td className="py-2.5 text-right text-zinc-600">{money(item.unitPrice, null)}</td>
                    <td className="py-2.5 text-right font-medium text-zinc-800">{money(item.total, null)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-[260px] space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-zinc-500">{t.subtotal}</span><span>{money(invoice.subtotal, invoice.currency)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">{t.tax}</span><span>{money(invoice.tax, invoice.currency)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">{t.shipping}</span><span>{money(invoice.shipping, invoice.currency)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">{t.discount}</span><span>{money(invoice.discount, invoice.currency)}</span></div>
            <div className="flex justify-between border-t border-zinc-300 pt-2 text-sm font-bold">
              <span>{t.grandTotal}</span>
              <span className="text-frsc-crimson-600">{money(invoice.grandTotal, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment & notes */}
        {(invoice.paymentMethod || invoice.notes) && (
          <div className="mt-8 grid gap-4 text-xs sm:grid-cols-2">
            {invoice.paymentMethod && (
              <div>
                <p className="text-[10px] font-bold tracking-wide text-zinc-500">{t.payment}</p>
                <p className="mt-1 text-zinc-700">{invoice.paymentMethod}</p>
              </div>
            )}
            {invoice.notes && (
              <div>
                <p className="text-[10px] font-bold tracking-wide text-zinc-500">{t.notes}</p>
                <p className="mt-1 text-zinc-700">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}

        {invoice.warnings.length > 0 && (
          <div className="mt-6 rounded-xl border border-amber-400/40 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t.needsReview}
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-amber-800">
              {invoice.warnings.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-8 text-center text-[10px] text-zinc-400">
          Dibuat oleh Farisium · {lang === 'id' ? 'template otomatis' : 'automatic template'}
        </p>
      </div>
    </div>
  )
}