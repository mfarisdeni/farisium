import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.farisium.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_PORT || '465') === '465',
  auth: {
    user: process.env.SMTP_USER || 'hello@farisium.com',
    pass: process.env.SMTP_PASS || '!221295xxXX',
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

function isSandbox(): boolean {
  return (process.env.KLIKQRIS_MODE ?? 'sandbox') === 'sandbox'
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { order_id, status, signature: webhookSig } = payload

    if (!order_id || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const adminDb = getAdminDb()
    const docRef = adminDb.collection('payments').doc(order_id)
    const snap = await docRef.get()

    if (!snap.exists) {
      console.warn(`F-Stream webhook: transaction ${order_id} not found`)
      return new NextResponse(null, { status: 200 })
    }

    const tx = snap.data()!

    if (tx.type !== 'fstream') {
      return new NextResponse(null, { status: 200 })
    }

    if (tx.signature && webhookSig && tx.signature !== webhookSig) {
      const bothSandbox =
        String(tx.signature).startsWith('SANDBOX_') &&
        String(webhookSig).startsWith('SANDBOX_')
      if (!isSandbox() || !bothSandbox) {
        console.error(`F-Stream webhook: invalid signature for ${order_id}`)
        return new NextResponse(null, { status: 200 })
      }
    }

    if (tx.status === 'PAID' || tx.status === 'SUCCESS') {
      return new NextResponse(null, { status: 200 })
    }

    if ((status === 'PAID' || status === 'SUCCESS') && tx.fstreamData) {
      const fdata = tx.fstreamData
      const tier = fdata.packageTier === 'paket-2' ? 'paket-2' : 'paket-1'
      const pkg = packageConfig[tier]
      const now = new Date()

      const orderData: Record<string, unknown> = {
        uid: fdata.uid ?? null,
        userEmail: fdata.userEmail ?? null,
        artistName: fdata.artistName,
        genre: fdata.genre,
        spotifyUrl: fdata.spotifyUrl,
        contact: fdata.contact,
        paymentMethod: 'IDR',
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
        paymentOrderId: order_id,
        estimatedStartAt: null,
        estimatedCompletedAt: null,
        adminNote: '',
        createdAt: now,
        updatedAt: now,
      }

      const orderRef = await adminDb.collection('fStreamBoostOrders').add(orderData)

      await docRef.update({
        status: 'PAID',
        paidAt: new Date().toISOString(),
        fstreamOrderId: orderRef.id,
        updatedAt: new Date().toISOString(),
      })

      try {
        await transporter.sendMail({
          from: '"Farisium Orders" <hello@farisium.com>',
          to: ORDER_TO_EMAIL,
          subject: `[PAID] New F-Stream Boost Order - ${fdata.artistName} (${tier})`,
          html: `
            <h2>New F-Stream Boost Order (Paid via QRIS)</h2>
            <p style="color:green;font-weight:bold;">Payment confirmed via KlikQRIS</p>
            <table style="border-collapse:collapse;width:100%;max-width:600px;">
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Payment Order ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${order_id}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Order ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${orderRef.id}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Artist Name</td><td style="padding:8px 12px;border:1px solid #ddd;">${fdata.artistName}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Genre</td><td style="padding:8px 12px;border:1px solid #ddd;">${fdata.genre}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Spotify Track URL</td><td style="padding:8px 12px;border:1px solid #ddd;"><a href="${fdata.spotifyUrl}">${fdata.spotifyUrl}</a></td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Contact</td><td style="padding:8px 12px;border:1px solid #ddd;">${fdata.contact}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Package</td><td style="padding:8px 12px;border:1px solid #ddd;">${pkg.name}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Amount Paid</td><td style="padding:8px 12px;border:1px solid #ddd;">Rp${pkg.priceIdr.toLocaleString('id-ID')}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Campaign Target</td><td style="padding:8px 12px;border:1px solid #ddd;">${pkg.streams} | ${pkg.listeners} | 7-10 days</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Status</td><td style="padding:8px 12px;border:1px solid #ddd;">${statusLabels.pending}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Paid At</td><td style="padding:8px 12px;border:1px solid #ddd;">${new Date().toISOString()}</td></tr>
            </table>
          `,
        })
      } catch {
        // Email failure should not block the order
      }

      console.log(`F-Stream webhook: ${order_id} → order ${orderRef.id} created for ${fdata.artistName}`)
    } else if (status === 'EXPIRED') {
      await docRef.update({
        status: 'EXPIRED',
        updatedAt: new Date().toISOString(),
      })
    }

    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error('F-Stream webhook error:', err)
    return new NextResponse(null, { status: 200 })
  }
}
