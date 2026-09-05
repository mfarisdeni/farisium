'use client'

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

import type { Auth, User } from 'firebase/auth'

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

export let db: ReturnType<typeof getFirestore> | null = null

if (isFirebaseConfigured) {
  app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)

  db = getFirestore(app)
}

export type { User }

/**
 * Auth is intentionally NOT imported at module scope.
 * `firebase/auth` (which kicks off the Firebase Auth iframe / popup machinery)
 * is only loaded when a user actually signs in or auth state is requested.
 * This keeps ~90 KiB of third-party JS off the initial critical path.
 */
async function getAuth(): Promise<Auth> {
  if (!app) throw new Error('Firebase is not configured.')
  const { getAuth } = await import('firebase/auth')
  return getAuth(app)
}

export async function signInWithGoogle(): Promise<void> {
  const auth = await getAuth()
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signOut(): Promise<void> {
  if (!app) return
  const auth = await getAuth()
  const { signOut: fbSignOut } = await import('firebase/auth')
  await fbSignOut(auth)
}

export function subscribeToAuth(
  callback: (user: User | null) => void,
): () => void {
  let cancelled = false
  let unsubscribe: (() => void) | undefined

  getAuth()
    .then(async (auth) => {
      if (cancelled) return
      const { onAuthStateChanged } = await import('firebase/auth')
      if (cancelled) return
      unsubscribe = onAuthStateChanged(auth, callback)
    })
    .catch(() => {
      if (!cancelled) callback(null)
    })

  return () => {
    cancelled = true
    unsubscribe?.()
  }
}