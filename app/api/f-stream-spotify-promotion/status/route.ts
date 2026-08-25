import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { getKlikQRISConfig } from '@/lib/klikqris-config'
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

export async function GET(request: Request) {
  const url = new URL(request.url)
  const orderId = url.searchParams.get('order_id')

  if (!orderId) {
    return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
  }

  const cfg = getKlikQRISConfig()

  try {
    const res = await fetch(`${cfg.base}/qris/status/${orderId}`, {
      headers: {
        'x-api-key': cfg.apiKey,
        'id_merchant': cfg.merchantId,
      },
    })
    const remote = await res.json()

    if (remote.status && remote.data) {
      const remoteStatus = remote.data.status
      const adminDb = getAdminDb()
      const snap = await adminDb.collection('payments').doc(orderId).get()

      if (snap.exists) {
        const local = snap.data()!

        if (local.status !== remoteStatus) {
          await adminDb.collection('payments').doc(orderId).update({
            status: remoteStatus,
            updatedAt: new Date().toISOString(),
          })
        }

        // Fallback: if payment is PAID but webhook didn't create order yet
        if (
          (remoteStatus === 'SUCCESS' || remoteStatus === 'PAID') &&
          local.type === 'fstream' &&
          local.fstreamData &&
          !local.fstreamOrderId
        ) {
          const recheck = await adminDb.collection('payments').doc(orderId).get()
          if (!recheck.data()?.fstreamOrderId) {
            const fdata = local.fstreamData
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
              paymentOrderId: orderId,
              estimatedStartAt: null,
              estimatedCompletedAt: null,
              adminNote: '',
              createdAt: now,
              updatedAt: now,
            }

            const orderRef = await adminDb.collection('fStreamBoostOrders').add(orderData)

            await adminDb.collection('payments').doc(orderId).update({
              fstreamOrderId: orderRef.id,
              updatedAt: new Date().toISOString(),
            })

            try {
              await transporter.sendMail({
                from: '"Farisium Orders" <hello@farisium.com>',
                to: ORDER_TO_EMAIL,
                subject: `[PAID-Fallback] New F-Stream Boost Order - ${fdata.artistName} (${tier})`,
                html: `
                  <h2>New F-Stream Boost Order (Paid via QRIS - Fallback)</h2>
                  <p style="color:orange;font-weight:bold;">Order created via status polling fallback</p>
                  <table style="border-collapse:collapse;width:100%;max-width:600px;">
                    <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Payment Order ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${orderId}</td></tr>
                    <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Order ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${orderRef.id}</td></tr>
                    <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Method</td><td style="padding:8px 12px;border:1px solid #ddd;">Status Polling Fallback</td></tr>
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

            console.log(`F-Stream status fallback: ${orderId} → order ${orderRef.id} created for ${fdata.artistName}`)
          }
        }

        const updatedSnap = await adminDb.collection('payments').doc(orderId).get()
        const updated = updatedSnap.data()!

        return NextResponse.json({
          orderId,
          status: updated.status || remoteStatus,
          totalAmount: remote.data.total_amount,
          paidAt: remote.data.paid_at ?? null,
          fstreamOrderId: updated.fstreamOrderId ?? null,
        })
      }
    }
  } catch {
    // Fallback to Firestore
  }

  const adminDb = getAdminDb()
  const snap = await adminDb.collection('payments').doc(orderId).get()

  if (!snap.exists) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  }

  const data = snap.data()!

  return NextResponse.json({
    orderId: data.orderId,
    status: data.status,
    totalAmount: data.totalAmount,
    paidAt: data.paidAt ?? null,
    fstreamOrderId: data.fstreamOrderId ?? null,
  })
}
