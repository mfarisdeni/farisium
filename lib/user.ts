import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type UpdateData,
} from 'firebase/firestore'

import { db } from './firebase'

export async function createUserIfNeeded(
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string,
): Promise<boolean> {
  if (!db) return false

  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      email,
      displayName: displayName ?? '',
      photoURL: photoURL ?? '',

      coins: 1,
      generations: 0,

      createdAt: Date.now(),

      lastRewardClaimAt: 0,
    })

    return true
  }

  const data = snap.data()

  const updates: UpdateData<typeof data> = {}

  if (data.displayName === undefined) {
    updates.displayName = displayName ?? ''
  }

  if (data.photoURL === undefined) {
    updates.photoURL = photoURL ?? ''
  }

  if (data.lastRewardClaimAt === undefined) {
    updates.lastRewardClaimAt = 0
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(ref, updates)
  }

  return false
}