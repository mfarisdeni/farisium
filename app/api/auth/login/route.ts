import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { sendNewUserNotification } from '@/lib/email/sendNewUserNotification'

export async function POST(req: Request) {
  try {
    const { uid, email, displayName } = await req.json()

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'uid and email are required' },
        { status: 400 },
      )
    }

    const db = getAdminDb()

    const countSnap = await db.collection('users').count().get()
    const totalUsers = countSnap.data().count

    const joinedDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    await sendNewUserNotification({
      email,
      displayName: displayName || email.split('@')[0],
      joinedDate,
      totalUsers,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 },
    )
  }
}
