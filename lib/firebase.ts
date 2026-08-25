'use client'

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth'

import {
  getFirestore,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/**
 * Firebase is optional for local/demo use. If the public env vars are absent
 * the app falls back to guest-only mode — no auth, full generation still works.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId,
)

let app: FirebaseApp | null = null
let auth: Auth | null = null

export let db: ReturnType<typeof getFirestore> | null = null

if (isFirebaseConfigured) {
  app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)

  auth = getAuth(app)
  db = getFirestore(app)
}

export type { User }

export async function signInWithGoogle(): Promise<void> {
  if (!auth) throw new Error('Firebase is not configured.')
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signOut(): Promise<void> {
  if (!auth) return
  await fbSignOut(auth)
}

export function subscribeToAuth(
  callback: (user: User | null) => void,
): () => void {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
