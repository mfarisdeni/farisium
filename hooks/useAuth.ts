'use client'

import { createUserIfNeeded } from '@/lib/user'
import { useEffect, useState } from 'react'
import {
  isFirebaseConfigured,
  signInWithGoogle,
  signOut,
  subscribeToAuth,
  type User,
} from '@/lib/firebase'

export interface AuthState {
  user: User | null
  loading: boolean
  configured: boolean
  signIn: () => Promise<void>
  logOut: () => Promise<void>
  authError: string | null
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
  const unsubscribe = subscribeToAuth(async (u) => {
  try {
    if (u?.uid) {
const isNew = await createUserIfNeeded(
  u.uid,
  u.email ?? '',
  u.displayName ?? '',
  u.photoURL ?? '',
)

if (isNew) {
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
    }),
  }).catch(() => {
    /* silent fail */
  })
}
    }
  } catch (err) {
    console.error(err)
  }

  setUser(u)
  setLoading(false)
})

  return unsubscribe
}, [])

  const signIn = async () => {
    setAuthError(null)
    try {
      console.log('[Auth] Starting Google sign-in...')
      await signInWithGoogle()
      console.log('[Auth] Google sign-in successful')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not sign in with Google.'
      console.error('[Auth] Sign-in error:', err)
      setAuthError(msg)
      alert(msg)
    }
  }

  const logOut = async () => {
    try {
      await signOut()
    } catch {
      /* no-op */
    }
  }

return {
  user,
  loading,
  configured: isFirebaseConfigured,
  signIn,
  logOut,
  authError,
}
}
