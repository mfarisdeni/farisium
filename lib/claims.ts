import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { db } from '@/lib/firebase'

export interface ClaimData {
  id: string
  rewardId: string
  name: string
  price: number
  partner: string
  bg: string
  logo: string
  claimedAt: Date
}

export async function saveClaim(
  uid: string,
  item: {
    id: string
    name: string
    price: number
    partner: string
    bg?: string
    logo?: string
  },
): Promise<boolean> {
  if (!db) return false

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) return false

    const currentClaims = snap.data().claims ?? []
    const newClaim = {
      rewardId: item.id,
      name: item.name,
      price: item.price,
      partner: item.partner,
      bg: item.bg ?? '',
      logo: item.logo ?? '',
      claimedAt: Date.now(),
    }

    await updateDoc(ref, { claims: [...currentClaims, newClaim] })
    return true
  } catch (err) {
    console.error('Failed to save claim:', err)
    return false
  }
}

export async function getUserClaims(uid: string): Promise<ClaimData[]> {
  if (!db) return []

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) return []

    const raw = snap.data().claims ?? []
    if (!Array.isArray(raw)) return []

    return (raw as Array<Record<string, unknown>>)
      .map((c, i) => ({
        id: `${c.rewardId ?? 'unknown'}-${i}`,
        rewardId: (c.rewardId as string) ?? '',
        name: (c.name as string) ?? '',
        price: (c.price as number) ?? 0,
        partner: (c.partner as string) ?? '',
        bg: (c.bg as string) ?? '',
        logo: (c.logo as string) ?? '',
        claimedAt: c.claimedAt
          ? new Date(c.claimedAt as number)
          : new Date(),
      }))
      .sort((a, b) => b.claimedAt.getTime() - a.claimedAt.getTime())
  } catch (err) {
    console.error('Failed to get claims:', err)
    return []
  }
}
