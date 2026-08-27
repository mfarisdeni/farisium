import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import { getKlikQRISConfig } from '@/lib/klikqris-config'
import {
  WEB_BUILDER_PACKAGES,
  MAX_PAGES,
  generateWebBuilderOrderId,
  calculateWebBuilderTotal,
  type WebBuilderOrderDocument,
} from '@/lib/web-builder-pricing'
import { sendCustomerOrderEmail } from '@/lib/email/web-builder-emails'

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>
    try {
      body = (await request.json()) ?? {}
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const { userEmail, name, contact, packageTier, pages, notes, locale, idToken } = body as {
      userEmail?: string | null
      name?: string
      contact?: string
      packageTier?: string
      pages?: number
      notes?: string
      locale?: string
      idToken?: string
    }

    if (!name?.trim() || !contact?.trim() || !packageTier) {
      return NextResponse.json({ error: 'Name, contact, and package are required.' }, { status: 400 })
    }

    const { pkg, totalPages, totalPriceIdr, normalTotalPriceIdr, discountPercent } =
      calculateWebBuilderTotal(packageTier, Number(pages))

    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package.' }, { status: 400 })
    }

    // Optional auth — guest orders allowed
    let uid: string | null = null
    let decodedEmail: string | null = null
    if (idToken) {
      try {
        const decoded = await getAdminAuth().verifyIdToken(idToken)
        uid = decoded.uid
        decodedEmail = decoded.email ?? null
      } catch {
        // Invalid token — continue as guest
      }
    }

    const orderId = generateWebBuilderOrderId()
    const now = new Date().toISOString()
    const adminDb = getAdminDb()
    const cfg = getKlikQRISConfig()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farisium.com'

    // Create QRIS payment
    const payRes = await fetch(`${cfg.base}/qris/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'id_merchant': cfg.merchantId,
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: totalPriceIdr,
        id_merchant: cfg.merchantId,
        keterangan: `Pembuatan Website ${pkg.name} x${totalPages} halaman`,
        callback_url: `${siteUrl}/api/payments/webhook`,
      }),
    })

    const payData = await payRes.json()

    if (!payData.status) {
      console.error('KlikQRIS create failed:', payData)
      return NextResponse.json({
        error: payData.message || 'Payment service error',
      }, { status: 502 })
    }

    const { signature, total_amount, qris_url, qris_image, expired_at } = payData.data

    // Persist payment record
    await adminDb.collection('payments').doc(orderId).set({
      uid: uid ?? 'guest',
      amount: 0,
      price: totalPriceIdr,
      orderId,
      externalReference: orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      status: 'PENDING',
      expiredAt: expired_at,
      createdAt: now,
      updatedAt: now,
    })

    // Persist order document
    const customerEmail = userEmail || decodedEmail || null
    const orderData: WebBuilderOrderDocument = {
      orderId,
      uid,
      userEmail: customerEmail,
      name: name.trim(),
      contact: contact.trim(),
      packageTier,
      packageName: pkg.name,
      pages: totalPages,
      pricePerPageIdr: pkg.pricePerPageIdr,
      normalPricePerPageIdr: normalTotalPriceIdr,
      totalPriceIdr,
      discountPercent,
      notes: (notes ?? '').trim().slice(0, 2000),
      status: 'pending_payment',
      paymentOrderId: orderId,
      locale: locale === 'en' ? 'en' : 'id',
      createdAt: now,
      updatedAt: now,
    }

    await adminDb.collection('webBuilderOrders').doc(orderId).set(orderData)

    // Send customer order email (non-blocking for order flow)
    if (customerEmail) {
      const emailLang = locale === 'en' ? 'en' : 'id'
      try {
        const { messageId } = await sendCustomerOrderEmail({
          orderId,
          name: name.trim(),
          email: customerEmail,
          packageName: pkg.name,
          pages: totalPages,
          pricePerPageIdr: pkg.pricePerPageIdr,
          totalPriceIdr,
          notes: (notes ?? '').trim().slice(0, 2000),
          createdAt: now,
          lang: emailLang,
        })
        const emailUpdate: Record<string, string> = {
          customerOrderEmailSentAt: new Date().toISOString(),
        }
        if (messageId) {
          emailUpdate.customerOrderEmailProviderId = messageId
        }
        await adminDb.collection('webBuilderOrders').doc(orderId).update(emailUpdate)
      } catch (emailErr) {
        console.error(`[OrderEmail] customer order email failed for ${orderId}:`, emailErr)
      }
    } else {
      console.log(`[OrderEmail] skipped — no customer email for ${orderId}`)
    }

    return NextResponse.json({
      success: true,
      orderId,
      totalPriceIdr,
      qrisImage: qris_image,
      qrisUrl: qris_url,
      totalAmount: total_amount,
      expiredAt: expired_at,
      paymentOrderId: orderId,
    })
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes('Firebase Admin not configured')
        ? err.message
        : 'Failed to create order.'
    console.error('Web builder order create error:', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
