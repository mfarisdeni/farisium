import * as React from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://farisium.com'

function formatIdr(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    })
  } catch {
    return iso
  }
}

interface FieldRowProps {
  label: string
  value: React.ReactNode
  border?: boolean
}

function FieldRow({ label, value, border = true }: FieldRowProps) {
  return (
    <tr>
      <td style={{ padding: '10px 0', color: '#888', fontSize: 13, width: 160, verticalAlign: 'top', borderTop: border ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
        {label}
      </td>
      <td style={{ padding: '10px 0', color: '#e0e0e0', fontSize: 14, borderTop: border ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
        {value}
      </td>
    </tr>
  )
}

function StatusBadge({ text, color }: { text: string; color: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, backgroundColor: color, color: '#fff' }}>
      {text}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Customer — Payment Confirmed                                      */
/* ------------------------------------------------------------------ */

export interface WebBuilderPaidEmailProps {
  orderId: string
  name: string
  totalPriceIdr: number
  paidAmount?: number
  paidAt: string
  lang: 'id' | 'en'
}

export function WebBuilderPaidEmail({
  orderId,
  name,
  totalPriceIdr,
  paidAmount,
  paidAt,
  lang,
}: WebBuilderPaidEmailProps) {
  const displayAmount = paidAmount ?? totalPriceIdr

  const t =
    lang === 'id'
      ? {
          heading: 'Pembayaran Berhasil',
          body: `Halo ${name}, pembayaran untuk pesanan website Anda telah berhasil diterima.`,
          invoiceLabel: 'Invoice',
          statusLabel: 'Status',
          statusText: 'PAID',
          paidLabel: 'Jumlah Dibayar',
          dateLabel: 'Dibayar Pada',
          processNote: 'Pesanan website Anda sudah masuk ke proses pengerjaan. Tim Farisium akan melanjutkan proses berdasarkan detail pesanan yang telah dikirim.',
          thanks: 'Terima kasih,',
        }
      : {
          heading: 'Payment Successful',
          body: `Hello ${name}, payment for your website order has been successfully received.`,
          invoiceLabel: 'Invoice',
          statusLabel: 'Status',
          statusText: 'PAID',
          paidLabel: 'Amount Paid',
          dateLabel: 'Paid At',
          processNote: 'Your website order is now in the processing queue. The Farisium team will proceed based on the order details you provided.',
          thanks: 'Thank you,',
        }

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", backgroundColor: '#0a0a0f', padding: '32px 16px' }}>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: 560, margin: '0 auto', backgroundColor: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
        {/* Brand */}
        <tr>
          <td style={{ padding: '32px 32px 16px' }}>
            <a href={SITE_URL} style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', textDecoration: 'none', letterSpacing: -0.5 }}>
              FARISIUM
            </a>
          </td>
        </tr>

        {/* Heading */}
        <tr>
          <td style={{ padding: '0 32px 8px' }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{t.heading}</h1>
          </td>
        </tr>
        <tr>
          <td style={{ padding: '0 32px 20px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#aaa', lineHeight: 1.5 }}>{t.body}</p>
          </td>
        </tr>

        {/* Divider */}
        <tr><td style={{ padding: '0 32px' }}><div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></td></tr>

        {/* Details */}
        <tr>
          <td style={{ padding: '16px 32px 8px' }}>
            <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
              <FieldRow label={t.invoiceLabel} value={<strong style={{ color: '#e0304e', fontSize: 15 }}>#{orderId}</strong>} border={false} />
              <FieldRow label={t.statusLabel} value={<StatusBadge text={t.statusText} color="#16a34a" />} />
              <FieldRow label={t.paidLabel} value={<strong style={{ color: '#ffffff', fontSize: 16 }}>{formatIdr(displayAmount)}</strong>} />
              <FieldRow label={t.dateLabel} value={formatDate(paidAt)} />
            </table>
          </td>
        </tr>

        {/* Divider */}
        <tr><td style={{ padding: '0 32px' }}><div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></td></tr>

        {/* Process note */}
        <tr>
          <td style={{ padding: '16px 32px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#aaa', lineHeight: 1.6 }}>{t.processNote}</p>
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td style={{ padding: '0 32px 24px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#aaa' }}>
              {t.thanks}
              <br />
              <strong style={{ color: '#e0304e' }}>Farisium</strong>
            </p>
          </td>
        </tr>
      </table>

      {/* Email footer */}
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: 560, margin: '0 auto' }}>
        <tr>
          <td style={{ padding: '24px 16px', textAlign: 'center', fontSize: 12, color: '#666' }}>
            &copy; {new Date().getFullYear()} Farisium. All rights reserved.
            <br />
            <a href={SITE_URL} style={{ color: '#e0304e', textDecoration: 'none' }}>farisium.com</a>
          </td>
        </tr>
      </table>
    </div>
  )
}
