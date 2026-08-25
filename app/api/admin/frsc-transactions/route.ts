import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const [txSnap, userSnap] = await Promise.all([
      adminDb.collection('frscTransactions').orderBy('createdAt', 'desc').limit(500).get(),
      adminDb.collection('users').get(),
    ])

    const transactions = txSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Build per-user net from transaction log
    const loggedNet: Record<string, number> = {}
    const userInfo: Record<string, { email: string | null; displayName: string | null }> = {}

    for (const tx of transactions) {
      const uid = (tx as any).uid
      if (!loggedNet[uid]) loggedNet[uid] = 0
      loggedNet[uid] += (tx as any).direction === 'in' ? (tx as any).amount : -(tx as any).amount

      if (!userInfo[uid]) {
        userInfo[uid] = { email: (tx as any).email ?? null, displayName: (tx as any).displayName ?? null }
      }
    }

    // Build current balance + info from users collection
    const users = userSnap.docs
      .map((doc) => {
        const data = doc.data()
        const uid = doc.id
        const currentBalance = data.coins ?? 0
        const net = loggedNet[uid] ?? 0
        const discrepancy = currentBalance - net

        if (!userInfo[uid]) {
          userInfo[uid] = { email: data.email ?? null, displayName: data.displayName ?? null }
        }

        return {
          uid,
          email: userInfo[uid]?.email ?? data.email ?? null,
          displayName: userInfo[uid]?.displayName ?? data.displayName ?? null,
          currentBalance,
          loggedNet: net,
          discrepancy,
          suspicious: discrepancy !== 0,
        }
      })
      .filter((u) => u.currentBalance > 0 || u.loggedNet !== 0)
      .sort((a, b) => Math.abs(b.discrepancy) - Math.abs(a.discrepancy))

    return NextResponse.json({ transactions, users })
  } catch (err) {
    console.error('frsc-transactions GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uid, email, displayName, type, amount, direction, description, referenceId } = body

    if (!uid || !type || !amount || !direction) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const docRef = await adminDb.collection('frscTransactions').add({
      uid,
      email: email ?? null,
      displayName: displayName ?? null,
      type,
      amount: Math.abs(amount),
      direction,
      description: description ?? '',
      referenceId: referenceId ?? null,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id: docRef.id })
  } catch (err) {
    console.error('frsc-transactions POST error:', err)
    return NextResponse.json({ error: 'Failed to log transaction' }, { status: 500 })
  }
}
