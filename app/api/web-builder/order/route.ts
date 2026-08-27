import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import {
  WEB_BUILDER_PACKAGES,
  MAX_PAGES,
  generateWebBuilderOrderId,
  calculateWebBuilderTotal,
  type WebBuilderOrderDocument,
} from '@/lib/web-builder-pricing'

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

    const { pkg, totalPages, totalPriceIdr, normalTotalPriceIdr, discountPercent } =
      calculateWebBuilderTotal(packageTier, Number(pages))

    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package.' }, { status: 400 })
    }

    const orderId = generateWebBuilderOrderId()
    const now = new Date().toISOString()
    const adminDb = getAdminDb()

    const orderData: WebBuilderOrderDocument = {
      orderId,
      uid,
      userEmail: userEmail ?? null,
      name: name.trim(),
      contact: contact.trim(),
      packageTier,
      packageName: pkg.name,
      pages: totalPages,
      pricePerPageIdr: pkg.pricePerPageIdr,
      normalPricePerPageIdr: pkg.normalPricePerPageIdr,
      totalPriceIdr,
      discountPercent,
      notes: (notes ?? '').trim().slice(0, 2000),
      status: 'pending_payment',
      paymentOrderId: null,
      createdAt: now,
      updatedAt: now,
    }

    await adminDb.collection('webBuilderOrders').doc(orderId).set(orderData)

    return NextResponse.json({
      success: true,
      orderId,
      totalPriceIdr,
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
