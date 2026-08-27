import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getKlikQRISConfig } from '@/lib/klikqris-config'
import { FieldValue } from 'firebase-admin/firestore'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const orderId = url.searchParams.get('order_id')

  if (!orderId) {
    return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
  }

  // Try to sync status from KlikQRIS (important for sandbox testing)
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
      const snap = await adminDb.collection('payments').doc(orderId).get()
      if (snap.exists) {
        const local = snap.data()!
        if (local.status !== remoteStatus && remoteStatus !== 'PENDING') {
          await adminDb.collection('payments').doc(orderId).update({
            status: remoteStatus,
            updatedAt: new Date().toISOString(),
          })
          // Credit coins when status transitions to paid
          if ((remoteStatus === 'SUCCESS' || remoteStatus === 'PAID') && local.status === 'PENDING') {
            const userRef = adminDb.collection('users').doc(local.uid)
            await userRef.update({
              coins: FieldValue.increment(local.amount),
            })

            const userSnap = await userRef.get()
            const userData = userSnap.data()

            await adminDb.collection('frscTransactions').add({
              uid: local.uid,
              email: userData?.email ?? local.email ?? null,
              displayName: userData?.displayName ?? null,
              type: 'purchase',
              amount: local.amount,
              direction: 'in',
              description: `Top-up ${local.amount} FRSC via KlikQRIS (status sync)`,
              referenceId: orderId,
              createdAt: new Date().toISOString(),
            })

            console.log(`Status sync: ${orderId} — ${local.amount} FRSC credited to ${local.uid}`)

            // If this payment is for a WebBuilder order, sync the order status
            if (local.externalReference && String(local.externalReference).startsWith('WB-')) {
              const wbOrderRef = adminDb.collection('webBuilderOrders').doc(String(local.externalReference))
              const wbSnap = await wbOrderRef.get()
              if (wbSnap.exists && wbSnap.data()?.status === 'pending_payment') {
                await wbOrderRef.update({
                  status: 'paid',
                  paidAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                })
                console.log(`Status sync: webBuilderOrder ${local.externalReference} marked paid`)
              }
            }
          }
        }
      }
      return NextResponse.json({
        orderId,
        status: remoteStatus,
        amount: remote.data.amount,
        totalAmount: remote.data.total_amount,
        paidAt: remote.data.paid_at ?? null,
      })
    }
  } catch {
    // Fallback to Firestore if KlikQRIS is unreachable
  }

  const snap = await adminDb.collection('payments').doc(orderId).get()

  if (!snap.exists) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
  }

  const data = snap.data()!

  return NextResponse.json({
    orderId: data.orderId,
    status: data.status,
    amount: data.amount,
    totalAmount: data.totalAmount,
    paidAt: data.paidAt ?? null,
  })
}
