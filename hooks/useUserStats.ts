'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import { db } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'

export function useUserStats() {
  const { user } = useAuth()

  const [generations, setGenerations] = useState(0)
  const [createdAt, setCreatedAt] = useState(0)
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    if (!user || !db) return

    const ref = doc(db, 'users', user.uid)

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return

      const data = snap.data()

      setGenerations(data.generations ?? 0)
      setCreatedAt(data.createdAt ?? 0)
      setCoins(data.coins ?? 0)
    })

    return unsubscribe
  }, [user])

  return {
    generations,
    createdAt,
    coins,
  }
}