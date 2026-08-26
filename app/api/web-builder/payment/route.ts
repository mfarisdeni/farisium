import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import { getKlikQRISConfig } from '@/lib/klikqris-config'

const PACKAGE_CONFIG: Record<
  string,
  {
    name: string
    pricePerPageIdr: number
    normalPricePerPageIdr: number
    discountPercent: number
  }
> = {
  startup: { name: 'Website Startup', pricePerPageIdr: 100000, normalPricePerPageIdr: 500000, discountPercent: 80 },
  freelance: { name: 'Website Freelance', pricePerPageIdr: 50000, normalPricePerPageIdr: 250000, discountPercent: 80 },
  lokal: { name: 'Website Bisnis Lokal', pricePerPageIdr: 30000, normalPricePerPageIdr: 150000, discountPercent: 80 },
  portfolio: { name: 'Website Portfolio / CV', pricePerPageIdr: 20000, normalPricePerPageIdr: 100000, discountPercent: 80 },
}

const MAX_PAGES = 20

function generateOrderId(uid: string, amount: number): string {
  const ts = Date.now()
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `WB-${amount}-${ts}-${rand}`
}

export async function POST(request: Request) {
  try {
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

    const { userEmail, name, contact, packageTier, pages, notes } = body as {
      userEmail?: string | null
      name?: string
      contact?: string
      packageTier?: string
      pages?: number
      notes?: string
    }

    if (!name?.trim() || !contact?.trim() || !packageTier) {
      return NextResponse.json({ error: 'Name, contact, and package are required.' }, { status: 400 })
    }

    const pkg = PACKAGE_CONFIG[packageTier]
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package.' }, { status: 400 })
    }

    const pageCount = Number(pages)
    if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > MAX_PAGES) {
      return NextResponse.json(
        { error: `Pages must be a whole number between 1 and ${MAX_PAGES}.` },
        { status: 400 },
      )
    }

    const totalPriceIdr = pkg.pricePerPageIdr * pageCount
    const orderId = generateOrderId(uid, totalPriceIdr)
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
        amount: totalPriceIdr,
        id_merchant: cfg.merchantId,
        keterangan: `Pembuatan Website ${pkg.name} x${pageCount} halaman`,
        callback_url: `${siteUrl}/api/payments/webhook`,
      }),
    })

    const data = await res.json()

    if (!data.status) {
      console.error('KlikQRIS create failed:', data)
      return NextResponse.json({
        error: data.message || 'Payment service error',
        detail: data,
      }, { status: 502 })
    }

    const { signature, total_amount, qris_url, qris_image, expired_at } = data.data
    const now = new Date()
    const adminDb = getAdminDb()

    await adminDb.collection('payments').doc(orderId).set({
      uid,
      amount: 0,
      price: totalPriceIdr,
      orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      status: 'PENDING',
      expiredAt: expired_at,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })

    const orderRef = await adminDb.collection('webBuilderOrders').add({
      uid,
      userEmail: userEmail ?? null,
      name: name.trim(),
      contact: contact.trim(),
      packageName: pkg.name,
      packageTier,
      pages: pageCount,
      pricePerPageIdr: pkg.pricePerPageIdr,
      normalPricePerPageIdr: pkg.normalPricePerPageIdr,
      totalPriceIdr,
      discountPercent: pkg.discountPercent,
      notes: (notes ?? '').trim().slice(0, 2000),
      paymentOrderId: orderId,
      status: 'pending',
      adminNote: '',
      createdAt: now,
      updatedAt: now,
    })

    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || 'mail.farisium.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT || '465') === '465',
        auth: {
          user: process.env.SMTP_USER || 'hello@farisium.com',
          pass: process.env.SMTP_PASS,
        },
      })
      await transporter.sendMail({
        from: '"Farisium Orders" <hello@farisium.com>',
        to: process.env.ORDER_TO_EMAIL || 'hello@farisium.com',
        subject: `New Web Builder Order (QRIS) - ${pkg.name} x${pageCount} (${name.trim()})`,
        html: `
          <h2>New Website Building Order (QRIS Payment)</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Name</td><td style="padding:8px 12px;border:1px solid #ddd;">${name.trim()}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Contact</td><td style="padding:8px 12px;border:1px solid #ddd;">${contact.trim()}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Package</td><td style="padding:8px 12px;border:1px solid #ddd;">${pkg.name}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Pages</td><td style="padding:8px 12px;border:1px solid #ddd;">${pageCount}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Total Price</td><td style="padding:8px 12px;border:1px solid #ddd;">Rp${totalPriceIdr.toLocaleString('id-ID')}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Notes</td><td style="padding:8px 12px;border:1px solid #ddd;">${(notes ?? '').trim().slice(0, 2000) || '-'}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Order ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${orderRef.id}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Payment ID</td><td style="padding:8px 12px;border:1px solid #ddd;">${orderId}</td></tr>
          </table>
        `,
      })
    } catch {
      // Email failure should not block the order
    }

    return NextResponse.json({
      orderId: orderRef.id,
      paymentOrderId: orderId,
      signature,
      totalAmount: total_amount,
      qrisUrl: qris_url,
      qrisImage: qris_image,
      expiredAt: expired_at,
      totalPriceIdr,
    })
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes('Firebase Admin not configured')
        ? err.message
        : 'Payment service unavailable'
    console.error('Web builder payment error:', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
