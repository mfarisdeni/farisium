import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snap = await adminDb
      .collection('payments')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get()

    const payments = await Promise.all(
      snap.docs.map(async (doc) => {
        const data = doc.data()

        let email = null
        let displayName = null
        try {
          const userSnap = await adminDb.collection('users').doc(data.uid).get()
          if (userSnap.exists) {
            const u = userSnap.data()
            email = u?.email ?? null
            displayName = u?.displayName ?? u?.name ?? null
          }
        } catch {
          // silent
        }

        return {
          id: doc.id,
          uid: data.uid,
          email,
          displayName,
          amount: data.amount,
          price: data.price,
          totalAmount: data.totalAmount,
          status: data.status,
          orderId: data.orderId,
          createdAt: data.createdAt ?? null,
          paidAt: data.paidAt ?? null,
          expiredAt: data.expiredAt ?? null,
        }
      })
    )

    return NextResponse.json({ payments })
  } catch (err) {
    console.error('Payment log error:', err)
    return NextResponse.json({ error: 'Failed to fetch payment log' }, { status: 500 })
  }
}
