import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
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

/**
 * Server-side source of truth for web builder pricing.
 * 1 FRSC = Rp 1. Promo price is a launch discount off typical market rates.
 */
const packageConfig: Record<
  string,
  {
    name: string
    pricePerPageIdr: number
    pricePerPageFrsc: number
    normalPricePerPageIdr: number
    normalPricePerPageFrsc: number
    discountPercent: number
  }
> = {
  startup: {
    name: 'Website Startup',
    pricePerPageIdr: 100000,
    pricePerPageFrsc: 100,
    normalPricePerPageIdr: 500000,
    normalPricePerPageFrsc: 500,
    discountPercent: 80,
  },
  freelance: {
    name: 'Website Freelance',
    pricePerPageIdr: 50000,
    pricePerPageFrsc: 50,
    normalPricePerPageIdr: 250000,
    normalPricePerPageFrsc: 250,
    discountPercent: 80,
  },
  lokal: {
    name: 'Website Bisnis Lokal',
    pricePerPageIdr: 30000,
    pricePerPageFrsc: 30,
    normalPricePerPageIdr: 150000,
    normalPricePerPageFrsc: 150,
    discountPercent: 80,
  },
  portfolio: {
    name: 'Website Portfolio / CV',
    pricePerPageIdr: 20000,
    pricePerPageFrsc: 20,
    normalPricePerPageIdr: 100000,
    normalPricePerPageFrsc: 100,
    discountPercent: 80,
  },
}

const MAX_PAGES = 20

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

    const { userEmail, name, contact, packageTier, pages, notes } = body as {
      uid?: string | null
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

    const pkg = packageConfig[packageTier]
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
    const totalPriceFrsc = pkg.pricePerPageFrsc * pageCount
    const now = new Date()
    const adminDb = getAdminDb()

    // Verify user exists
    const userRef = adminDb.collection('users').doc(uid)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const userData = userSnap.data()!

    const orderData: Record<string, unknown> = {
      uid,
      userEmail: userEmail ?? userData.email ?? null,
      name: name.trim(),
      contact: contact.trim(),
      packageName: pkg.name,
      packageTier,
      pages: pageCount,
      pricePerPageIdr: pkg.pricePerPageIdr,
      pricePerPageFrsc: pkg.pricePerPageFrsc,
      totalPriceIdr,
      totalPriceFrsc,
      normalTotalPriceIdr: pkg.normalPricePerPageIdr * pageCount,
      discountPercent: pkg.discountPercent,
      notes: (notes ?? '').trim().slice(0, 2000),
      status: 'pending',
      adminNote: '',
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb.collection('webBuilderOrders').add(orderData)

    try {
      await transporter.sendMail({
        from: '"Farisium Orders" <hello@farisium.com>',
        to: ORDER_TO_EMAIL,
        subject: `New Web Builder Order - ${pkg.name} x${pageCount} (${name.trim()})`,
        html: `
          <h2>New Website Building Order</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Name</td><td style="padding:8px 12px;border:1px solid #ddd;">${name.trim()}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Contact</td><td style="padding:8px 12px;border:1px solid #ddd;">${contact.trim()}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Package</td><td style="padding:8px 12px;border:1px solid #ddd;">${pkg.name}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Pages</td><td style="padding:8px 12px;border:1px solid #ddd;">${pageCount}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Total Price</td><td style="padding:8px 12px;border:1px solid #ddd;">Rp${totalPriceIdr.toLocaleString('id-ID')} / ${totalPriceFrsc} FRSC</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Normal Price</td><td style="padding:8px 12px;border:1px solid #ddd;">Rp${(pkg.normalPricePerPageIdr * pageCount).toLocaleString('id-ID')}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;border:1px solid #ddd;">Notes</td><td style="padding:8px 12px;border:1px solid #ddd;">${(notes ?? '').trim().slice(0, 2000) || '-'}</td></tr>
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
      totalPriceIdr,
      totalPriceFrsc,
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to submit order.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
