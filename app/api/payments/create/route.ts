import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getKlikQRISConfig } from '@/lib/klikqris-config'

const TIERS: Record<number, number> = {
  10: 10000,
  30: 25000,
  75: 50000,
  200: 100000,
}

function generateOrderId(uid: string, amount: number): string {
  const ts = Date.now()
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `FRSC-${amount}-${ts}-${rand}`
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { uid, amount } = (body ?? {}) as { uid?: string; amount?: number }

  if (!uid || typeof uid !== 'string') {
    return NextResponse.json({ error: 'uid is required' }, { status: 400 })
  }

  const price = TIERS[amount ?? 0]
  if (!price) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const orderId = generateOrderId(uid, amount as number)
  const cfg = getKlikQRISConfig()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farisium.com'

  try {
    const res = await fetch(`${cfg.base}/qris/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'id_merchant': cfg.merchantId,
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: price,
        id_merchant: cfg.merchantId,
        keterangan: `Pembelian ${amount} FRSC`,
        callback_url: `${siteUrl}/api/payments/webhook`,
      }),
    })

    const data = await res.json()

    if (!data.status) {
      console.error('KlikQRIS create failed:', data)
      return NextResponse.json({
        error: data.message || `KlikQRIS error: ${data.status}`,
        detail: data,
      }, { status: 502 })
    }

    const { signature, total_amount, qris_url, qris_image, expired_at, expired_menit } = data.data

    await adminDb.collection('payments').doc(orderId).set({
      uid,
      amount,
      price,
      orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      status: 'PENDING',
      expiredAt: expired_at,
      expiredMinutes: expired_menit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      expiredAt: expired_at,
    })
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes('Firebase Admin not configured')
        ? err.message
        : 'Payment service unavailable'
    console.error('KlikQRIS create error:', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
