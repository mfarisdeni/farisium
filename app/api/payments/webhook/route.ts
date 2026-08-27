import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { sendAdminPaidEmail, sendCustomerPaidEmail } from '@/lib/email/web-builder-emails'

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

      // If this payment is for a WebBuilder order, sync the order status
      if (tx.externalReference && String(tx.externalReference).startsWith('WB-')) {
        const wbOrderRef = adminDb.collection('webBuilderOrders').doc(String(tx.externalReference))
        const wbSnap = await wbOrderRef.get()
        if (wbSnap.exists && wbSnap.data()?.status === 'pending_payment') {
          const wbData = wbSnap.data()!
          const now = new Date().toISOString()
          await wbOrderRef.update({
            status: 'paid',
            paidAt: now,
            updatedAt: now,
          })
          console.log(`Webhook: webBuilderOrder ${tx.externalReference} marked paid`)

          // Send paid emails — idempotent (only if not already sent)
          if (!wbData.adminPaidEmailSentAt) {
            const paidAt = now
            const emailPayload = {
              orderId: String(tx.externalReference),
              uid: wbData.uid,
              name: wbData.name,
              email: wbData.userEmail ?? tx.email ?? '',
              contact: wbData.contact,
              packageName: wbData.packageName,
              packageTier: wbData.packageTier,
              pages: wbData.pages,
              pricePerPageIdr: wbData.pricePerPageIdr,
              totalPriceIdr: wbData.totalPriceIdr,
              notes: wbData.notes ?? '',
              createdAt: wbData.createdAt,
              paidAt,
              paidAmount: total_amount ?? tx.totalAmount,
              paymentOrderId: order_id,
              locale: wbData.locale ?? 'id',
            }
            try {
              await sendAdminPaidEmail(emailPayload)
              await wbOrderRef.update({ adminPaidEmailSentAt: paidAt })
              console.log(`Webhook: admin paid email sent for ${tx.externalReference}`)
            } catch (emailErr) {
              console.error(`[PaidEmail] admin email failed for ${tx.externalReference}:`, emailErr)
            }
            // Customer paid email — idempotent
            if (!wbData.customerPaidEmailSentAt && wbData.userEmail) {
              try {
                await sendCustomerPaidEmail({
                  orderId: String(tx.externalReference),
                  name: wbData.name,
                  email: wbData.userEmail,
                  totalPriceIdr: wbData.totalPriceIdr,
                  paidAmount: total_amount ?? tx.totalAmount,
                  paidAt,
                  lang: wbData.locale === 'en' ? 'en' : 'id',
                })
                await wbOrderRef.update({ customerPaidEmailSentAt: paidAt })
                console.log(`Webhook: customer paid email sent for ${tx.externalReference}`)
              } catch (emailErr) {
                console.error(`[PaidEmail] customer paid email failed for ${tx.externalReference}:`, emailErr)
              }
            }
          }
        }
      }
    } else if (status === 'EXPIRED') {
      await docRef.update({
        status: 'EXPIRED',
        updatedAt: new Date().toISOString(),
      })

      // If this payment is for a WebBuilder order, sync expiry
      if (tx.externalReference && String(tx.externalReference).startsWith('WB-')) {
        const wbOrderRef = adminDb.collection('webBuilderOrders').doc(String(tx.externalReference))
        const wbSnap = await wbOrderRef.get()
        if (wbSnap.exists && wbSnap.data()?.status === 'pending_payment') {
          await wbOrderRef.update({
            status: 'cancelled',
            updatedAt: new Date().toISOString(),
          })
          console.log(`Webhook: webBuilderOrder ${tx.externalReference} marked cancelled (expired)`)
        }
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new NextResponse(null, { status: 200 })
  }
}
