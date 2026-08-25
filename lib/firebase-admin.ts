import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import type { Firestore } from 'firebase-admin/firestore'

let _adminDb: Firestore | null = null

export function getAdminDb(): Firestore {
  if (_adminDb) return _adminDb

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY'
    )
  }

  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        })

  _adminDb = getFirestore(app)
  return _adminDb
}

export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    const real = getAdminDb()
    const value = real[prop as keyof Firestore]
    return typeof value === 'function' ? value.bind(real) : value
  },
})