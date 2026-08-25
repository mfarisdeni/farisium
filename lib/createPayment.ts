import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

export async function createPayment(
  uid: string,
  email: string
) {
  if (!db) throw new Error('Firebase not configured')

  const docRef = await addDoc(
    collection(db, 'payments'),
    {
      uid,
      email,
      coins: 20,
      amount: 10000,
      currency: 'IDR',
      provider: 'doku',
      status: 'pending',
      claimed: false,
      createdAt: serverTimestamp(),
    }
  )

  return docRef.id
}