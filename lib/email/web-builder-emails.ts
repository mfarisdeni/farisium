import { getResend } from './resend'
import { WebBuilderOrderEmail } from '@/components/email/web-builder-order-email'
import { WebBuilderPaidEmail } from '@/components/email/web-builder-paid-email'
import { WebBuilderAdminPaidEmail } from '@/components/email/web-builder-admin-paid-email'

const EMAIL_FROM = process.env.EMAIL_FROM || 'Farisium <hello@farisium.com>'
const ADMIN_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'hello@farisium.com'

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

  const resend = getResend()
  const { data: resendData, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [data.email],
    subject,
    react: WebBuilderOrderEmail({
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
    }),
  })

  if (error) {
    console.error(`[OrderEmail] Resend error for ${data.orderId}:`, error)
    return {}
  }

  if (resendData?.id) {
    console.log(`[OrderEmail] sent to ${data.email} for ${data.orderId} — Resend ID: ${resendData.id}`)
    return { messageId: resendData.id }
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

  const resend = getResend()
  const { data: resendData, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [data.email],
    subject,
    react: WebBuilderPaidEmail({
      orderId: data.orderId,
      name: data.name,
      totalPriceIdr: data.totalPriceIdr,
      paidAmount: data.paidAmount,
      paidAt: data.paidAt,
      lang: data.lang,
    }),
  })

  if (error) {
    console.error(`[PaidEmail] Resend error for ${data.orderId}:`, error)
    return {}
  }

  if (resendData?.id) {
    console.log(`[PaidEmail] sent to ${data.email} for ${data.orderId} — Resend ID: ${resendData.id}`)
    return { messageId: resendData.id }
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

  const resend = getResend()
  const { data: resendData, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [ADMIN_EMAIL],
    subject: `[PAID] Website Builder Order #${data.orderId} — Rp ${displayAmount.toLocaleString('id-ID')}`,
    react: WebBuilderAdminPaidEmail({
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
    }),
  })

  if (error) {
    console.error(`[AdminPaidEmail] Resend error for ${data.orderId}:`, error)
    return {}
  }

  if (resendData?.id) {
    console.log(`[AdminPaidEmail] sent to ${ADMIN_EMAIL} for ${data.orderId} — Resend ID: ${resendData.id}`)
    return { messageId: resendData.id }
  }

  return {}
}
