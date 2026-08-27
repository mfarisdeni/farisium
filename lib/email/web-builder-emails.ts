import { getResend } from './resend'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://farisium.com'
const EMAIL_FROM = process.env.EMAIL_FROM || 'Farisium <hello@farisium.com>'
const ADMIN_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'hello@farisium.com'
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

function waConfirmUrl(orderId: string, lang: 'id' | 'en'): string {
  const msg =
    lang === 'id'
      ? `Halo Farisium, saya sudah melakukan pembayaran untuk invoice #${orderId}.\n\nMohon dibantu konfirmasi pembayaran dan proses pesanan website saya.\n\nTerima kasih.`
      : `Hello Farisium, I have completed the payment for invoice #${orderId}.\n\nPlease help confirm my payment and process my website order.\n\nThank you.`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

function tgConfirmUrl(orderId: string, lang: 'id' | 'en'): string {
  const msg =
    lang === 'id'
      ? `Halo Farisium, saya sudah melakukan pembayaran untuk invoice #${orderId}.\n\nMohon dibantu konfirmasi pembayaran dan proses pesanan website saya.\n\nTerima kasih.`
      : `Hello Farisium, I have completed the payment for invoice #${orderId}.\n\nPlease help confirm my payment and process my website order.\n\nThank you.`
  return `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(msg)}`
}

/* ------------------------------------------------------------------ */
/*  Shared email shell                                                */
/* ------------------------------------------------------------------ */

function emailShell(content: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#111118;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;">
        ${content}
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:24px 16px;text-align:center;font-size:12px;color:#666;">
          &copy; ${new Date().getFullYear()} Farisium. All rights reserved.<br/>
          <a href="${SITE_URL}" style="color:#e0304e;text-decoration:none;">farisium.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function brandHeader(): string {
  return `
  <tr><td style="padding:32px 32px 16px;">
    <a href="${SITE_URL}" style="font-size:20px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.5px;">FARISIUM</a>
  </td></tr>`
}

function statusBadge(text: string, color: string): string {
  return `<span style="display:inline-block;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;background-color:${color};color:#fff;">${text}</span>`
}

function divider(): string {
  return `<tr><td style="padding:0 32px;"><div style="border-top:1px solid rgba(255,255,255,0.06);margin:0;"></div></td></tr>`
}

function fieldRow(label: string, value: string, border = true): string {
  return `
  <tr>
    <td style="padding:10px 0;color:#888;font-size:13px;width:160px;vertical-align:top;${border ? 'border-top:1px solid rgba(255,255,255,0.06);' : ''}">${label}</td>
    <td style="padding:10px 0;color:#e0e0e0;font-size:14px;${border ? 'border-top:1px solid rgba(255,255,255,0.06);' : ''}">${value}</td>
  </tr>`
}

function ctaButton(href: string, label: string, bgColor = '#e0304e'): string {
  return `
  <tr><td style="padding:8px 32px;">
    <a href="${href}" style="display:inline-block;padding:12px 28px;border-radius:10px;background-color:${bgColor};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;text-align:center;">
      ${label}
    </a>
  </td></tr>`
}

/* ------------------------------------------------------------------ */
/*  Customer — Order Created                                          */
/* ------------------------------------------------------------------ */

export interface CustomerOrderEmailData {
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

export async function sendCustomerOrderEmail(data: CustomerOrderEmailData) {
  if (!data.email || !data.email.includes('@')) {
    console.log(`[OrderEmail] skipped — no valid customer email for ${data.orderId}`)
    return
  }

  const { orderId, name, packageName, pages, pricePerPageIdr, totalPriceIdr, notes, createdAt, lang } = data
  const payUrl = `${SITE_URL}/${lang}/frsc?order=${orderId}`
  const waUrl = waConfirmUrl(orderId, lang)
  const tgUrl = tgConfirmUrl(orderId, lang)

  const t = lang === 'id'
    ? {
        subject: `Pesanan Website Farisium #${orderId}`,
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
        brand: 'Farisium',
      }
    : {
        subject: `Your Farisium Website Order #${orderId}`,
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
        brand: 'Farisium',
      }

  const content = `
${brandHeader()}
<tr><td style="padding:0 32px 8px;">
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${t.heading}</h1>
</td></tr>
<tr><td style="padding:0 32px 4px;">
  <p style="margin:0;font-size:14px;color:#aaa;line-height:1.5;">${t.greeting}</p>
</td></tr>
<tr><td style="padding:0 32px 20px;">
  <p style="margin:0;font-size:14px;color:#aaa;line-height:1.5;">${t.body}</p>
</td></tr>
${divider()}
<tr><td style="padding:16px 32px 8px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${fieldRow(t.invoiceLabel, `<strong style="color:#e0304e;font-size:15px;">#${orderId}</strong>`, false)}
    ${fieldRow(t.statusLabel, statusBadge(t.statusText, '#d97706'))}
    ${fieldRow(t.nameLabel, name)}
    ${fieldRow(t.emailLabel, data.email)}
    ${fieldRow(t.packageLabel, packageName)}
    ${fieldRow(t.pagesLabel, `${pages} ${lang === 'id' ? 'halaman' : 'pages'}`)}
    ${fieldRow(t.priceLabel, formatIdr(pricePerPageIdr) + (lang === 'id' ? ' /halaman' : ' /page'))}
    ${fieldRow(t.totalLabel, `<strong style="color:#ffffff;font-size:16px;">${formatIdr(totalPriceIdr)}</strong>`)}
    ${notes ? fieldRow(t.notesLabel, notes.length > 200 ? notes.slice(0, 200) + '...' : notes) : ''}
    ${fieldRow(t.paymentLabel, t.paymentText)}
    ${fieldRow(t.dateLabel, formatDate(createdAt))}
  </table>
</td></tr>
${divider()}
${ctaButton(payUrl, t.payButton)}
<tr><td style="padding:20px 32px 4px;">
  <p style="margin:0;font-size:14px;color:#ffffff;font-weight:600;">${t.confirmHeading}</p>
</td></tr>
<tr><td style="padding:4px 32px 4px;">
  <p style="margin:0;font-size:13px;color:#aaa;line-height:1.5;">${t.confirmBody}</p>
</td></tr>
${ctaButton(waUrl, t.waButton, '#25D366')}
${ctaButton(tgUrl, t.tgButton, '#0088CC')}
<tr><td style="padding:24px 32px;">
  <p style="margin:0;font-size:14px;color:#aaa;">${t.thanks}<br/><strong style="color:#e0304e;">${t.brand}</strong></p>
</td></tr>`

  const resend = getResend()
  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.email,
    subject: t.subject,
    html: emailShell(content),
  })
}

/* ------------------------------------------------------------------ */
/*  Customer — Payment Confirmed                                      */
/* ------------------------------------------------------------------ */

export interface CustomerPaidEmailData {
  orderId: string
  name: string
  email: string
  totalPriceIdr: number
  paidAmount?: number
  paidAt: string
  lang: 'id' | 'en'
}

export async function sendCustomerPaidEmail(data: CustomerPaidEmailData) {
  if (!data.email || !data.email.includes('@')) {
    console.log(`[PaidEmail] skipped — no valid customer email for ${data.orderId}`)
    return
  }

  const { orderId, name, totalPriceIdr, paidAmount, paidAt, lang } = data

  const t = lang === 'id'
    ? {
        subject: `Pembayaran Diterima — #${orderId}`,
        heading: 'Pembayaran Berhasil',
        body: `Halo ${name}, pembayaran untuk pesanan website Anda telah berhasil diterima.`,
        invoiceLabel: 'Invoice',
        statusLabel: 'Status',
        statusText: 'PAID',
        paidLabel: 'Jumlah Dibayar',
        dateLabel: 'Dibayar Pada',
        processNote: 'Pesanan website Anda sudah masuk ke proses pengerjaan. Tim Farisium akan melanjutkan proses berdasarkan detail pesanan yang telah dikirim.',
        thanks: 'Terima kasih,',
        brand: 'Farisium',
      }
    : {
        subject: `Payment Confirmed — #${orderId}`,
        heading: 'Payment Successful',
        body: `Hello ${name}, payment for your website order has been successfully received.`,
        invoiceLabel: 'Invoice',
        statusLabel: 'Status',
        statusText: 'PAID',
        paidLabel: 'Amount Paid',
        dateLabel: 'Paid At',
        processNote: 'Your website order is now in the processing queue. The Farisium team will proceed based on the order details you provided.',
        thanks: 'Thank you,',
        brand: 'Farisium',
      }

  const displayAmount = paidAmount ?? totalPriceIdr

  const content = `
${brandHeader()}
<tr><td style="padding:0 32px 8px;">
  <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${t.heading}</h1>
</td></tr>
<tr><td style="padding:0 32px 20px;">
  <p style="margin:0;font-size:14px;color:#aaa;line-height:1.5;">${t.body}</p>
</td></tr>
${divider()}
<tr><td style="padding:16px 32px 8px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${fieldRow(t.invoiceLabel, `<strong style="color:#e0304e;font-size:15px;">#${orderId}</strong>`, false)}
    ${fieldRow(t.statusLabel, statusBadge(t.statusText, '#16a34a'))}
    ${fieldRow(t.paidLabel, `<strong style="color:#ffffff;font-size:16px;">${formatIdr(displayAmount)}</strong>`)}
    ${fieldRow(t.dateLabel, formatDate(paidAt))}
  </table>
</td></tr>
${divider()}
<tr><td style="padding:16px 32px;">
  <p style="margin:0;font-size:14px;color:#aaa;line-height:1.6;">${t.processNote}</p>
</td></tr>
<tr><td style="padding:0 32px 24px;">
  <p style="margin:0;font-size:14px;color:#aaa;">${t.thanks}<br/><strong style="color:#e0304e;">${t.brand}</strong></p>
</td></tr>`

  const resend = getResend()
  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.email,
    subject: t.subject,
    html: emailShell(content),
  })
}

/* ------------------------------------------------------------------ */
/*  Admin — Payment Confirmed (hello@farisium.com)                    */
/* ------------------------------------------------------------------ */

export interface AdminPaidEmailData {
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

export async function sendAdminPaidEmail(data: AdminPaidEmailData) {
  const {
    orderId, uid, name, email, contact, packageName, packageTier, pages,
    pricePerPageIdr, totalPriceIdr, notes, createdAt, paidAt,
    paidAmount, paymentOrderId, locale,
  } = data

  const displayAmount = paidAmount ?? totalPriceIdr
  const orderPageUrl = `${SITE_URL}/id/frsc?order=${orderId}`

  const content = `
${brandHeader()}
<tr><td style="padding:0 32px 8px;">
  <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.3;">WEBSITE BUILDER — PAYMENT RECEIVED</h1>
</td></tr>
<tr><td style="padding:0 32px 20px;">
  ${statusBadge('PAID', '#16a34a')}
</td></tr>
${divider()}
<tr><td style="padding:16px 32px 8px;">
  <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Order Details</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${fieldRow('Invoice', `<strong style="color:#e0304e;font-size:15px;">#${orderId}</strong>`, false)}
    ${fieldRow('Status', statusBadge('PAID', '#16a34a'))}
    ${fieldRow('Customer', name)}
    ${fieldRow('Email', email)}
    ${fieldRow('Contact (WA)', contact)}
    ${fieldRow('User ID', `<span style="font-size:12px;color:#666;">${uid}</span>`)}
    ${fieldRow('Package', packageName)}
    ${fieldRow('Tier', packageTier)}
    ${fieldRow('Pages', `${pages}`)}
    ${fieldRow('Price / Page', formatIdr(pricePerPageIdr))}
    ${fieldRow('Order Total', `<strong style="color:#ffffff;font-size:16px;">${formatIdr(totalPriceIdr)}</strong>`)}
    ${fieldRow('Paid Amount', `<strong style="color:#16a34a;font-size:16px;">${formatIdr(displayAmount)}</strong>`)}
    ${fieldRow('Payment ID', paymentOrderId ? `<span style="font-size:12px;color:#666;">${paymentOrderId}</span>` : '-')}
    ${fieldRow('Payment Method', 'QRIS (KlikQRIS)')}
    ${fieldRow('Order Created', formatDate(createdAt))}
    ${fieldRow('Paid At', `<strong style="color:#16a34a;">${formatDate(paidAt)}</strong>`)}
    ${fieldRow('Locale', locale?.toUpperCase() ?? 'ID')}
  </table>
</td></tr>
${notes ? `
${divider()}
<tr><td style="padding:16px 32px 8px;">
  <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Customer Notes</p>
  <p style="margin:0;font-size:14px;color:#ccc;line-height:1.5;background:rgba(255,255,255,0.03);padding:12px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);">${notes.length > 500 ? notes.slice(0, 500) + '...' : notes}</p>
</td></tr>` : ''}
${divider()}
<tr><td style="padding:16px 32px;">
  <p style="margin:0;font-size:13px;color:#aaa;line-height:1.6;">
    The Website Builder order is ready to be processed.<br/>
    Customer has been notified with payment confirmation.
  </p>
</td></tr>
${ctaButton(orderPageUrl, 'Open Order', '#642f7f')}
<tr><td style="padding:8px 32px 24px;">
  <p style="margin:0;font-size:12px;color:#666;">This is an automated notification from Farisium.</p>
</td></tr>`

  const resend = getResend()
  await resend.emails.send({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject: `[PAID] Website Builder Order #${orderId} — ${formatIdr(totalPriceIdr)}`,
    html: emailShell(content),
  })
}
