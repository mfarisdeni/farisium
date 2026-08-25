import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

function isSandbox(): boolean {
  return (process.env.KLIKQRIS_MODE ?? 'sandbox') === 'sandbox'
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { order_id, status, signature: webhookSig, total_amount } = payload

    if (!order_id || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const docRef = adminDb.collection('payments').doc(order_id)
    const snap = await docRef.get()

    if (!snap.exists) {
      console.warn(`Webhook: transaction ${order_id} not found`)
      return new NextResponse(null, { status: 200 })
    }

    const tx = snap.data()!

    // Sandbox: create response sends SANDBOX_SIG_xxx but webhook sends SANDBOX_SIGNATURE_xxx
    if (tx.signature && webhookSig && tx.signature !== webhookSig) {
      const bothSandbox = String(tx.signature).startsWith('SANDBOX_') && String(webhookSig).startsWith('SANDBOX_')
      if (!isSandbox() || !bothSandbox) {
        console.error(`Webhook: invalid signature for ${order_id}`)
        return new NextResponse(null, { status: 200 })
      }
    }

    if (tx.status === 'PAID' || tx.status === 'SUCCESS') {
      return new NextResponse(null, { status: 200 })
    }

    if (status === 'PAID' || status === 'SUCCESS') {
      await docRef.update({
        status: 'PAID',
        totalAmount: total_amount ?? tx.totalAmount,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const userRef = adminDb.collection('users').doc(tx.uid)
      await userRef.update({
        coins: FieldValue.increment(tx.amount),
      })

      const userSnap = await userRef.get()
      const userData = userSnap.data()

      await adminDb.collection('frscTransactions').add({
        uid: tx.uid,
        email: userData?.email ?? tx.email ?? null,
        displayName: userData?.displayName ?? null,
        type: 'purchase',
        amount: tx.amount,
        direction: 'in',
        description: `Top-up ${tx.amount} FRSC via KlikQRIS`,
        referenceId: order_id,
        createdAt: new Date().toISOString(),
      })

      console.log(`Webhook: ${order_id} — ${tx.amount} FRSC credited to ${tx.uid}`)
    } else if (status === 'EXPIRED') {
      await docRef.update({
        status: 'EXPIRED',
        updatedAt: new Date().toISOString(),
      })
    }

    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new NextResponse(null, { status: 200 })
  }
}
