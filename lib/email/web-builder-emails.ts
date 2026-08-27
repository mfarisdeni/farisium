import { render } from '@react-email/render'
import { sendSmtpMail } from './smtp'
import { WebBuilderOrderEmail } from '@/components/email/web-builder-order-email'
import { WebBuilderPaidEmail } from '@/components/email/web-builder-paid-email'
import { WebBuilderAdminPaidEmail } from '@/components/email/web-builder-admin-paid-email'

const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL || 'hello@farisium.com'

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

export async function sendCustomerOrderEmail(data: CustomerOrderEmailData): Promise<{ messageId?: string }> {
  if (!data.email || !data.email.includes('@')) {
    console.log(`[OrderEmail] skipped — no valid customer email for ${data.orderId}`)
    return {}
  }

  const subject =
    data.lang === 'id'
      ? `Pesanan Website Farisium #${data.orderId}`
      : `Your Farisium Website Order #${data.orderId}`

  const html = await render(WebBuilderOrderEmail({
    orderId: data.orderId,
    name: data.name,
    email: data.email,
    packageName: data.packageName,
    pages: data.pages,
    pricePerPageIdr: data.pricePerPageIdr,
    totalPriceIdr: data.totalPriceIdr,
    notes: data.notes,
    createdAt: data.createdAt,
    lang: data.lang,
  }))

  const result = await sendSmtpMail({ to: data.email, subject, html })

  if (result.error) {
    console.error(`[OrderEmail] SMTP error for ${data.orderId}:`, result.error)
    return {}
  }

  if (result.messageId) {
    console.log(`[OrderEmail] sent to ${data.email} for ${data.orderId} — messageId: ${result.messageId}`)
    return { messageId: result.messageId }
  }

  return {}
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

export async function sendCustomerPaidEmail(data: CustomerPaidEmailData): Promise<{ messageId?: string }> {
  if (!data.email || !data.email.includes('@')) {
    console.log(`[PaidEmail] skipped — no valid customer email for ${data.orderId}`)
    return {}
  }

  const subject =
    data.lang === 'id'
      ? `Pembayaran Diterima — #${data.orderId}`
      : `Payment Confirmed — #${data.orderId}`

  const html = await render(WebBuilderPaidEmail({
    orderId: data.orderId,
    name: data.name,
    totalPriceIdr: data.totalPriceIdr,
    paidAmount: data.paidAmount,
    paidAt: data.paidAt,
    lang: data.lang,
  }))

  const result = await sendSmtpMail({ to: data.email, subject, html })

  if (result.error) {
    console.error(`[PaidEmail] SMTP error for ${data.orderId}:`, result.error)
    return {}
  }

  if (result.messageId) {
    console.log(`[PaidEmail] sent to ${data.email} for ${data.orderId} — messageId: ${result.messageId}`)
    return { messageId: result.messageId }
  }

  return {}
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

export async function sendAdminPaidEmail(data: AdminPaidEmailData): Promise<{ messageId?: string }> {
  const displayAmount = data.paidAmount ?? data.totalPriceIdr

  const html = await render(WebBuilderAdminPaidEmail({
    orderId: data.orderId,
    uid: data.uid,
    name: data.name,
    email: data.email,
    contact: data.contact,
    packageName: data.packageName,
    packageTier: data.packageTier,
    pages: data.pages,
    pricePerPageIdr: data.pricePerPageIdr,
    totalPriceIdr: data.totalPriceIdr,
    notes: data.notes,
    createdAt: data.createdAt,
    paidAt: data.paidAt,
    paidAmount: data.paidAmount,
    paymentOrderId: data.paymentOrderId,
    locale: data.locale,
  }))

  const result = await sendSmtpMail({
    to: ADMIN_EMAIL,
    subject: `[PAID] Website Builder Order #${data.orderId} — Rp ${displayAmount.toLocaleString('id-ID')}`,
    html,
  })

  if (result.error) {
    console.error(`[AdminPaidEmail] SMTP error for ${data.orderId}:`, result.error)
    return {}
  }

  if (result.messageId) {
    console.log(`[AdminPaidEmail] sent to ${ADMIN_EMAIL} for ${data.orderId} — messageId: ${result.messageId}`)
    return { messageId: result.messageId }
  }

  return {}
}
