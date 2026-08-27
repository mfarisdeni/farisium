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

function CtaButton({ href, label, bgColor = '#642f7f' }: { href: string; label: string; bgColor?: string }) {
  return (
    <tr>
      <td style={{ padding: '8px 32px' }}>
        <a
          href={href}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 10,
            backgroundColor: bgColor,
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          {label}
        </a>
      </td>
    </tr>
  )
}

/* ------------------------------------------------------------------ */
/*  Admin — Payment Confirmed                                         */
/* ------------------------------------------------------------------ */

export interface WebBuilderAdminPaidEmailProps {
  orderId: string
  uid: string
  name: string
  email: string
  contact: string
  packageName: string
  packageTier: string
  pages: number
  pricePerPageIdr: number
  totalPriceIdr: number
  notes: string
  createdAt: string
  paidAt: string
  paidAmount?: number
  paymentOrderId?: string | null
  locale?: string
}

export function WebBuilderAdminPaidEmail({
  orderId,
  uid,
  name,
  email,
  contact,
  packageName,
  packageTier,
  pages,
  pricePerPageIdr,
  totalPriceIdr,
  notes,
  createdAt,
  paidAt,
  paidAmount,
  paymentOrderId,
  locale,
}: WebBuilderAdminPaidEmailProps) {
  const displayAmount = paidAmount ?? totalPriceIdr
  const orderPageUrl = `${SITE_URL}/id/frsc?order=${orderId}`

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
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
              WEBSITE BUILDER — PAYMENT RECEIVED
            </h1>
          </td>
        </tr>
        <tr>
          <td style={{ padding: '0 32px 20px' }}>
            <StatusBadge text="PAID" color="#16a34a" />
          </td>
        </tr>

        {/* Divider */}
        <tr><td style={{ padding: '0 32px' }}><div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></td></tr>

        {/* Order details */}
        <tr>
          <td style={{ padding: '16px 32px 8px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Order Details
            </p>
            <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
              <FieldRow label="Invoice" value={<strong style={{ color: '#e0304e', fontSize: 15 }}>#{orderId}</strong>} border={false} />
              <FieldRow label="Status" value={<StatusBadge text="PAID" color="#16a34a" />} />
              <FieldRow label="Customer" value={name} />
              <FieldRow label="Email" value={email} />
              <FieldRow label="Contact (WA)" value={contact} />
              <FieldRow label="User ID" value={<span style={{ fontSize: 12, color: '#666' }}>{uid}</span>} />
              <FieldRow label="Package" value={packageName} />
              <FieldRow label="Tier" value={packageTier} />
              <FieldRow label="Pages" value={`${pages}`} />
              <FieldRow label="Price / Page" value={formatIdr(pricePerPageIdr)} />
              <FieldRow label="Order Total" value={<strong style={{ color: '#ffffff', fontSize: 16 }}>{formatIdr(totalPriceIdr)}</strong>} />
              <FieldRow label="Paid Amount" value={<strong style={{ color: '#16a34a', fontSize: 16 }}>{formatIdr(displayAmount)}</strong>} />
              <FieldRow label="Payment ID" value={paymentOrderId ? <span style={{ fontSize: 12, color: '#666' }}>{paymentOrderId}</span> : '-'} />
              <FieldRow label="Payment Method" value="QRIS (KlikQRIS)" />
              <FieldRow label="Order Created" value={formatDate(createdAt)} />
              <FieldRow label="Paid At" value={<strong style={{ color: '#16a34a' }}>{formatDate(paidAt)}</strong>} />
              <FieldRow label="Locale" value={locale?.toUpperCase() ?? 'ID'} />
            </table>
          </td>
        </tr>

        {/* Notes */}
        {notes ? (
          <>
            <tr><td style={{ padding: '0 32px' }}><div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></td></tr>
            <tr>
              <td style={{ padding: '16px 32px 8px' }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Customer Notes
                </p>
                <p style={{ margin: 0, fontSize: 14, color: '#ccc', lineHeight: 1.5, background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                  {notes.length > 500 ? notes.slice(0, 500) + '...' : notes}
                </p>
              </td>
            </tr>
          </>
        ) : null}

        {/* Divider */}
        <tr><td style={{ padding: '0 32px' }}><div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></td></tr>

        {/* Action note */}
        <tr>
          <td style={{ padding: '16px 32px' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>
              The Website Builder order is ready to be processed.
              <br />
              Customer has been notified with payment confirmation.
            </p>
          </td>
        </tr>

        {/* CTA */}
        <CtaButton href={orderPageUrl} label="Open Order" />

        {/* Footer */}
        <tr>
          <td style={{ padding: '8px 32px 24px' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>This is an automated notification from Farisium.</p>
          </td>
        </tr>
      </table>
    </div>
  )
}
