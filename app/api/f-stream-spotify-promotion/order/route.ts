import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.farisium.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_PORT || '465') === '465',
  auth: {
    user: process.env.SMTP_USER || 'hello@farisium.com',
    pass: process.env.SMTP_PASS,
  },
})

const ORDER_TO_EMAIL = process.env.ORDER_TO_EMAIL || 'hello@farisium.com'

const packageConfig: Record<
  string,
  {
    name: string
    priceIdr: number
    priceFrsc: number
    normalPriceIdr: number
    normalPriceFrsc: number
    streams: string
    listeners: string
  }
> = {
  'paket-1': {
    name: 'F-Stream Boost Spotify Promotion - Paket 1',
    priceIdr: 299000,
    priceFrsc: 600,
    normalPriceIdr: 1000000,
    normalPriceFrsc: 2000,
    streams: '+1,000 Spotify stream target',
    listeners: '300+ new monthly listener target',
  },
  'paket-2': {
    name: 'F-Stream Boost Spotify Promotion - Paket 2',
    priceIdr: 399000,
    priceFrsc: 800,
    normalPriceIdr: 1500000,
    normalPriceFrsc: 3000,
    streams: '+3,000 Spotify stream target',
    listeners: '600+ new monthly listener target',
  },
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  reviewing: 'Reviewing',
  waiting_payment: 'Waiting Payment',
  processing: 'Processing Campaign',
  completed: 'Completed',
  cancelled: 'Cancelled',
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
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 },
      )
    }

    const {
      userEmail,
      artistName,
      genre,
      spotifyUrl,
      contact,
      paymentMethod,
      packageTier,
    } = body as {
      uid?: string | null
      userEmail?: string | null
      artistName?: string
      genre?: string
      spotifyUrl?: string
      contact?: string
      paymentMethod?: string
      packageTier?: string
    }

    if (!artistName || !genre || !spotifyUrl || !contact || !paymentMethod) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 },
      )
    }

    if (
      typeof spotifyUrl === 'string' &&
      (!spotifyUrl.includes('spotify.com') || !spotifyUrl.includes('/track/'))
    ) {
      return NextResponse.json(
        { error: 'Invalid Spotify Track URL. Must contain spotify.com and /track/.' },
        { status: 400 },
      )
    }

    const tier = packageTier === 'paket-2' ? 'paket-2' : 'paket-1'
    const pkg = packageConfig[tier]
    const now = new Date()
    const adminDb = getAdminDb()

    if (paymentMethod === 'FRSC') {
      const userRef = adminDb.collection('users').doc(uid)
      const userSnap = await userRef.get()

      if (!userSnap.exists) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 })
      }

      const userData = userSnap.data()!
      const currentCoins: number = userData.coins ?? 0

      if (currentCoins < pkg.priceFrsc) {
        return NextResponse.json({
          error: `Insufficient FRSC coins. Required: ${pkg.priceFrsc}, Current: ${currentCoins}.`,
        }, { status: 400 })
      }

      await userRef.update({
        coins: FieldValue.increment(-pkg.priceFrsc),
      })

      await adminDb.collection('frscTransactions').add({
        uid,
        email: userEmail ?? userData.email ?? null,
        displayName: userData.displayName ?? null,
        type: 'spend',
        amount: pkg.priceFrsc,
        direction: 'out',
        description: `F-Stream Boost ${pkg.name}`,
        referenceId: null,
        createdAt: now.toISOString(),
      })
    }

    const orderData: Record<string, unknown> = {
      uid: uid ?? null,
      userEmail: userEmail ?? null,
      artistName,
      genre,
      spotifyUrl,
      contact,
      paymentMethod,
      packageName: pkg.name,
      packageTier: tier,
      priceIdr: pkg.priceIdr,
      priceFrsc: pkg.priceFrsc,
      normalPriceIdr: pkg.normalPriceIdr,
      normalPriceFrsc: pkg.normalPriceFrsc,
      status: 'pending',
      campaignTarget: {
        streams: pkg.streams,
        listeners: pkg.listeners,
        duration: '7–10 days',
      },
      estimatedStartAt: null,
      estimatedCompletedAt: null,
      adminNote: '',
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb.collection('fStreamBoostOrders').add(orderData)

    try {
      await transporter.sendMail({
        from: '"Farisium Orders" <hello@farisium.com>',
        to: ORDER_TO_EMAIL,
        subject: `New F-Stream Boost Order - ${artistName} (${tier})`,
        html: `
          <h2>New F-Stream Boost Spotify Promotion Order</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Artist Name</td><td style="padding:8px 12px;border:1px solid #ddd;">${artistName}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Genre</td><td style="padding:8px 12px;border:1px solid #ddd;">${genre}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Spotify Track URL</td><td style="padding:8px 12px;border:1px solid #ddd;"><a href="${spotifyUrl}">${spotifyUrl}</a></td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Contact</td><td style="padding:8px 12px;border:1px solid #ddd;">${contact}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Payment Method</td><td style="padding:8px 12px;border:1px solid #ddd;">${paymentMethod}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Package</td><td style="padding:8px 12px;border:1px solid #ddd;">${pkg.name}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Special Price</td><td style="padding:8px 12px;border:1px solid #ddd;">Rp${pkg.priceIdr.toLocaleString('id-ID')} / ${pkg.priceFrsc} FRSC</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Normal Price</td><td style="padding:8px 12px;border:1px solid #ddd;">Rp${pkg.normalPriceIdr.toLocaleString('id-ID')} / ${pkg.normalPriceFrsc} FRSC</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Campaign Target</td><td style="padding:8px 12px;border:1px solid #ddd;">${pkg.streams} | ${pkg.listeners} | 7-10 days</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Status</td><td style="padding:8px 12px;border:1px solid #ddd;">${statusLabels.pending}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Order ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${docRef.id}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Created Date</td><td style="padding:8px 12px;border:1px solid #ddd;">${now.toISOString()}</td></tr>
          </table>
        `,
      })
    } catch {
      // Email failure should not block the order
    }

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to submit order.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
