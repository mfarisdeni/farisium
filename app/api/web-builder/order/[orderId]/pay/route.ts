import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import { getKlikQRISConfig } from '@/lib/klikqris-config'
import type { WebBuilderOrderDocument } from '@/lib/web-builder-pricing'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params

    if (!orderId || !orderId.startsWith('WB-')) {
      return NextResponse.json({ error: 'Invalid order ID.' }, { status: 400 })
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }
    const idToken = authHeader.slice(7)
    let decoded
    try {
      decoded = await getAdminAuth().verifyIdToken(idToken)
    } catch {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 })
    }
    const uid = decoded.uid

    const adminDb = getAdminDb()
    const orderDoc = await adminDb.collection('webBuilderOrders').doc(orderId).get()

    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    const order = orderDoc.data() as WebBuilderOrderDocument

    if (order.uid !== uid) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    if (order.status === 'paid' || order.status === 'processing' || order.status === 'completed') {
      return NextResponse.json({ error: 'Order already paid.' }, { status: 409 })
    }

    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Order has been cancelled.' }, { status: 409 })
    }

    // Check for existing active KlikQRIS transaction
    if (order.paymentOrderId) {
      const existingPayment = await adminDb.collection('payments').doc(order.paymentOrderId).get()
      if (existingPayment.exists) {
        const paymentData = existingPayment.data()!
        if (paymentData.status === 'PENDING') {
          const expiredAt = paymentData.expiredAt
          if (expiredAt) {
            const expTime = new Date(String(expiredAt).replace(' ', 'T')).getTime()
            if (expTime > Date.now()) {
              return NextResponse.json({
                orderId: order.paymentOrderId,
                signature: paymentData.signature,
                totalAmount: paymentData.totalAmount,
                qrisUrl: paymentData.qrisUrl,
                qrisImage: paymentData.qrisImage,
                expiredAt: paymentData.expiredAt,
                totalPriceIdr: order.totalPriceIdr,
              })
            }
          } else {
            return NextResponse.json({
              orderId: order.paymentOrderId,
              signature: paymentData.signature,
              totalAmount: paymentData.totalAmount,
              qrisUrl: paymentData.qrisUrl,
              qrisImage: paymentData.qrisImage,
              expiredAt: paymentData.expiredAt,
              totalPriceIdr: order.totalPriceIdr,
            })
          }
        }
      }
    }

    // Create new KlikQRIS transaction
    const cfg = getKlikQRISConfig()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farisium.com'

    const res = await fetch(`${cfg.base}/qris/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'id_merchant': cfg.merchantId,
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: order.totalPriceIdr,
        id_merchant: cfg.merchantId,
        keterangan: `Pembuatan Website ${order.packageName} x${order.pages} halaman`,
        callback_url: `${siteUrl}/api/payments/webhook`,
      }),
    })

    const data = await res.json()

    if (!data.status) {
      console.error('KlikQRIS create failed:', data)
      return NextResponse.json({
        error: data.message || 'Payment service error',
      }, { status: 502 })
    }

    const { signature, total_amount, qris_url, qris_image, expired_at } = data.data
    const now = new Date().toISOString()

    // Save payment record
    await adminDb.collection('payments').doc(orderId).set({
      uid,
      amount: 0,
      price: order.totalPriceIdr,
      orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      status: 'PENDING',
      expiredAt: expired_at,
      createdAt: now,
      updatedAt: now,
    })

    // Link payment to order
    await adminDb.collection('webBuilderOrders').doc(orderId).update({
      paymentOrderId: orderId,
      updatedAt: now,
    })

    return NextResponse.json({
      orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      expiredAt: expired_at,
      totalPriceIdr: order.totalPriceIdr,
    })
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes('Firebase Admin not configured')
        ? err.message
        : 'Payment service unavailable'
    console.error('Web builder pay error:', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
