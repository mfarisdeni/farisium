import * as React from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://farisium.com'
const WA_NUMBER = process.env.FARISIUM_WHATSAPP_NUMBER || '6282130358145'
const TG_USERNAME = process.env.FARISIUM_TELEGRAM_USERNAME || 'farisium'

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

interface CtaButtonProps {
  href: string
  label: string
  bgColor?: string
}

function CtaButton({ href, label, bgColor = '#e0304e' }: CtaButtonProps) {
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
/*  Customer — Order Created                                          */
/* ------------------------------------------------------------------ */

export interface WebBuilderOrderEmailProps {
  orderId: string
  name: string
  email: string
  packageName: string
  pages: number
  pricePerPageIdr: number
  totalPriceIdr: number
  notes: string
  createdAt: string
  lang: 'id' | 'en'
}

export function WebBuilderOrderEmail({
  orderId,
  name,
  email,
  packageName,
  pages,
  pricePerPageIdr,
  totalPriceIdr,
  notes,
  createdAt,
  lang,
}: WebBuilderOrderEmailProps) {
  const payUrl = `${SITE_URL}/${lang}/frsc?order=${orderId}`
  const waMsg =
    lang === 'id'
      ? `Halo Farisium, saya sudah melakukan pembayaran untuk invoice #${orderId}.\n\nMohon dibantu konfirmasi pembayaran dan proses pesanan website saya.\n\nTerima kasih.`
      : `Hello Farisium, I have completed the payment for invoice #${orderId}.\n\nPlease help confirm my payment and process my website order.\n\nThank you.`
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`
  const tgUrl = `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(waMsg)}`

  const t =
    lang === 'id'
      ? {
          heading: 'Pesanan Website Anda Telah Dibuat',
          greeting: `Halo ${name},`,
          body: 'Terima kasih telah mempercayakan pembuatan website Anda kepada Farisium.',
          invoiceLabel: 'Invoice',
          statusLabel: 'Status',
          statusText: 'Menunggu Pembayaran',
          nameLabel: 'Nama',
          emailLabel: 'Email',
          packageLabel: 'Paket',
          pagesLabel: 'Jumlah Halaman',
          priceLabel: 'Harga per Halaman',
          totalLabel: 'Total Pesanan',
          notesLabel: 'Catatan',
          paymentLabel: 'Metode Pembayaran',
          paymentText: 'QRIS',
          dateLabel: 'Tanggal Pesanan',
          payButton: 'Lihat & Bayar Pesanan',
          confirmHeading: 'Sudah melakukan pembayaran?',
          confirmBody: 'Agar tim kami dapat membantu pengecekan lebih cepat, Anda juga dapat menghubungi kami:',
          waButton: 'Konfirmasi via WhatsApp',
          tgButton: 'Konfirmasi via Telegram',
          thanks: 'Terima kasih,',
        }
      : {
          heading: 'Your Website Order Has Been Created',
          greeting: `Hello ${name},`,
          body: 'Thank you for trusting Farisium with your website creation.',
          invoiceLabel: 'Invoice',
          statusLabel: 'Status',
          statusText: 'Awaiting Payment',
          nameLabel: 'Name',
          emailLabel: 'Email',
          packageLabel: 'Package',
          pagesLabel: 'Pages',
          priceLabel: 'Price per Page',
          totalLabel: 'Order Total',
          notesLabel: 'Notes',
          paymentLabel: 'Payment Method',
          paymentText: 'QRIS',
          dateLabel: 'Order Date',
          payButton: 'View & Pay Order',
          confirmHeading: 'Already paid?',
          confirmBody: 'For faster processing, you can also reach us directly:',
          waButton: 'Confirm via WhatsApp',
          tgButton: 'Confirm via Telegram',
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
          <td style={{ padding: '0 32px 4px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#aaa', lineHeight: 1.5 }}>{t.greeting}</p>
          </td>
        </tr>
        <tr>
          <td style={{ padding: '0 32px 20px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#aaa', lineHeight: 1.5 }}>{t.body}</p>
          </td>
        </tr>

        {/* Divider */}
        <tr><td style={{ padding: '0 32px' }}><div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></td></tr>

        {/* Order details */}
        <tr>
          <td style={{ padding: '16px 32px 8px' }}>
            <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
              <FieldRow label={t.invoiceLabel} value={<strong style={{ color: '#e0304e', fontSize: 15 }}>#{orderId}</strong>} border={false} />
              <FieldRow label={t.statusLabel} value={<StatusBadge text={t.statusText} color="#d97706" />} />
              <FieldRow label={t.nameLabel} value={name} />
              <FieldRow label={t.emailLabel} value={email} />
              <FieldRow label={t.packageLabel} value={packageName} />
              <FieldRow label={t.pagesLabel} value={`${pages} ${lang === 'id' ? 'halaman' : 'pages'}`} />
              <FieldRow label={t.priceLabel} value={formatIdr(pricePerPageIdr) + (lang === 'id' ? ' /halaman' : ' /page')} />
              <FieldRow label={t.totalLabel} value={<strong style={{ color: '#ffffff', fontSize: 16 }}>{formatIdr(totalPriceIdr)}</strong>} />
              {notes ? <FieldRow label={t.notesLabel} value={notes.length > 200 ? notes.slice(0, 200) + '...' : notes} /> : null}
              <FieldRow label={t.paymentLabel} value={t.paymentText} />
              <FieldRow label={t.dateLabel} value={formatDate(createdAt)} />
            </table>
          </td>
        </tr>

        {/* Divider */}
        <tr><td style={{ padding: '0 32px' }}><div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} /></td></tr>

        {/* CTA */}
        <CtaButton href={payUrl} label={t.payButton} />

        {/* Confirm section */}
        <tr>
          <td style={{ padding: '20px 32px 4px' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#ffffff', fontWeight: 600 }}>{t.confirmHeading}</p>
          </td>
        </tr>
        <tr>
          <td style={{ padding: '4px 32px 4px' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>{t.confirmBody}</p>
          </td>
        </tr>
        <CtaButton href={waUrl} label={t.waButton} bgColor="#25D366" />
        <CtaButton href={tgUrl} label={t.tgButton} bgColor="#0088CC" />

        {/* Footer */}
        <tr>
          <td style={{ padding: '24px 32px' }}>
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
