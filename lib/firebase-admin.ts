import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getAuth, type Auth } from 'firebase-admin/auth'

let _adminDb: Firestore | null = null
let _adminAuth: Auth | null = null

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY'
    )
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  })
}

export function getAdminDb(): Firestore {
  if (_adminDb) return _adminDb
  _adminDb = getFirestore(getAdminApp())
  return _adminDb
}

export function getAdminAuth(): Auth {
  if (_adminAuth) return _adminAuth
  _adminAuth = getAuth(getAdminApp())
  return _adminAuth
}

export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    const real = getAdminDb()
    const value = real[prop as keyof Firestore]
    return typeof value === 'function' ? value.bind(real) : value
  },
})