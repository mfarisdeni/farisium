import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin'
import type { WebBuilderOrderDocument } from '@/lib/web-builder-pricing'

export async function GET(
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
    const doc = await adminDb.collection('webBuilderOrders').doc(orderId).get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    const order = doc.data() as WebBuilderOrderDocument

    if (order.uid !== uid) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    return NextResponse.json({
      orderId: order.orderId,
      packageName: order.packageName,
      packageTier: order.packageTier,
      pages: order.pages,
      pricePerPageIdr: order.pricePerPageIdr,
      normalPricePerPageIdr: order.normalPricePerPageIdr,
      totalPriceIdr: order.totalPriceIdr,
      discountPercent: order.discountPercent,
      name: order.name,
      contact: order.contact,
      notes: order.notes,
      status: order.status,
      createdAt: order.createdAt,
    })
  } catch (err) {
    console.error('Web builder order get error:', err)
    return NextResponse.json({ error: 'Failed to load order.' }, { status: 500 })
  }
}
