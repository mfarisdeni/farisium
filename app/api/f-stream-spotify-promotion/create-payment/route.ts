import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import { getKlikQRISConfig } from '@/lib/klikqris-config'

const PRICES: Record<string, number> = {
  'paket-1': 299000,
  'paket-2': 399000,
}

const PACKAGE_LABELS: Record<string, string> = {
  'paket-1': 'F-Stream Boost Paket 1',
  'paket-2': 'F-Stream Boost Paket 2',
}

function generateOrderId(tier: string): string {
  const ts = Date.now()
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  const prefix = tier === 'paket-2' ? 'FSTREAM-P2' : 'FSTREAM-P1'
  return `${prefix}-${ts}-${rand}`
}

export async function POST(request: Request) {
  try {
    // Verify Firebase ID token
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

    let body: Record<string, unknown>
    try {
      body = (await request.json()) ?? {}
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const {
      userEmail,
      artistName,
      genre,
      spotifyUrl,
      contact,
      paymentMethod,
      packageTier,
    } = body as Record<string, string | undefined>

    if (!artistName || !genre || !spotifyUrl || !contact || !paymentMethod || !packageTier) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (paymentMethod !== 'IDR') {
      return NextResponse.json({ error: 'This endpoint only supports IDR payments.' }, { status: 400 })
    }

    const tier = packageTier === 'paket-2' ? 'paket-2' : 'paket-1'
    const price = PRICES[tier]

    if (!price) {
      return NextResponse.json({ error: 'Invalid package tier.' }, { status: 400 })
    }

    const orderId = generateOrderId(tier)
    const cfg = getKlikQRISConfig()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farisium.com'

    if (
      typeof spotifyUrl === 'string' &&
      (!spotifyUrl.includes('spotify.com') || !spotifyUrl.includes('/track/'))
    ) {
      return NextResponse.json(
        { error: 'Invalid Spotify Track URL.' },
        { status: 400 },
      )
    }

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
        keterangan: PACKAGE_LABELS[tier],
        callback_url: `${siteUrl}/api/f-stream-spotify-promotion/webhook`,
      }),
    })

    const data = await res.json()

    if (!data.status) {
      console.error('KlikQRIS create failed:', data)
      return NextResponse.json({
        error: data.message || 'Payment creation failed.',
      }, { status: 502 })
    }

    const { signature, total_amount, qris_url, qris_image, expired_at, expired_menit } = data.data

    const adminDb = getAdminDb()

    await adminDb.collection('payments').doc(orderId).set({
      uid,
      type: 'fstream',
      amount: 0,
      price,
      orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      status: 'PENDING',
      expiredAt: expired_at,
      expiredMinutes: expired_menit,
      fstreamData: {
        uid,
        userEmail: userEmail ?? null,
        artistName,
        genre,
        spotifyUrl,
        contact,
        paymentMethod,
        packageTier: tier,
      },
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
    console.error('F-Stream create payment error:', err)
    return NextResponse.json({ error: 'Payment service unavailable.' }, { status: 502 })
  }
}
