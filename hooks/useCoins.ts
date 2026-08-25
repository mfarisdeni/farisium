'use client'

import { useEffect, useState } from 'react'
import {
  doc,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore'

import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'

async function logTransaction(params: {
  uid: string
  email?: string | null
  displayName?: string | null
  type: string
  amount: number
  direction: 'in' | 'out'
  description?: string
}) {
  try {
    await fetch('/api/admin/frsc-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
  } catch {
    // silent — don't block the user action
  }
}

export function useCoins() {
  const { user } = useAuth()

  const [coins, setCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null)
  const [captionGenerations, setCaptionGenerations] = useState(0)

const addCoin = async () => {
  if (!user || !db) return false

  try {
    const ref = doc(db, 'users', user.uid)

    await updateDoc(ref, {
      coins: increment(1),
    })

    setCoins((prev) => prev + 1)

    logTransaction({
      uid: user.uid,
      email: user.email ?? userEmail,
      displayName: user.displayName ?? userDisplayName,
      type: 'reward',
      amount: 1,
      direction: 'in',
      description: 'Daily FRSC reward claim',
    })

    return true
  } catch (err) {
    console.error('Failed to add coin', err)
    return false
  }
}

  async function loadCoins() {
    if (!user || !db) {
      setCoins(0)
      setLoading(false)
      return
    }

    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)

    if (snap.exists()) {
      const data = snap.data()
      setCoins(data.coins ?? 0)
      setCaptionGenerations(data.captionGenerations ?? 0)
      setUserEmail(data.email ?? null)
      setUserDisplayName(data.displayName ?? null)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadCoins()
  }, [user])

 const deductCoin = async () => {
  if (!user || !db) return
  if (coins <= 0) return

  try {
    const ref = doc(db, 'users', user.uid)

    await updateDoc(ref, {
      coins: increment(-1),
    })

    setCoins((prev) => Math.max(0, prev - 1))

    logTransaction({
      uid: user.uid,
      email: user.email ?? userEmail,
      displayName: user.displayName ?? userDisplayName,
      type: 'spend',
      amount: 1,
      direction: 'out',
      description: 'Anime generation usage',
    })
  } catch (err) {
    console.error('Failed to deduct coin', err)
  }
}
  
const addCoins = async (amount: number) => {
  if (!user || !db) return

  try {
    const ref = doc(db, 'users', user.uid)

    await updateDoc(ref, {
      coins: increment(amount),
    })

    setCoins((prev) => prev + amount)

    logTransaction({
      uid: user.uid,
      email: user.email ?? userEmail,
      displayName: user.displayName ?? userDisplayName,
      type: 'reward',
      amount,
      direction: 'in',
      description: `Reward claim: +${amount} FRSC`,
    })
  } catch (err) {
    console.error('Failed to add coins', err)
  }
}

const incrementGeneration = async () => {
  if (!user || !db) return

  try {
    const ref = doc(db, 'users', user.uid)

    await updateDoc(ref, {
      generations: increment(1),
    })
  } catch (err) {
    console.error(
      'Failed to increment generations',
      err
    )
  }
}

const incrementCaptionGeneration = async () => {
  if (!user || !db) return

  try {
    const ref = doc(db, 'users', user.uid)

    await updateDoc(ref, {
      captionGenerations: increment(1),
    })

    setCaptionGenerations((prev) => prev + 1)
  } catch (err) {
    console.error(
      'Failed to increment caption generations',
      err
    )
  }
}

return {
  coins,
  loading,
  deductCoin,
  addCoins,
  addCoin,
  incrementGeneration,
  incrementCaptionGeneration,
  refreshCoins: loadCoins,
  captionGenerations,
}
}