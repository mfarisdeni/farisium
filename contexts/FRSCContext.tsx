'use client'

import React, { createContext, useContext } from 'react'
import { useCoins } from '@/hooks/useCoins'

interface FRSCContextValue {
  coins: number
  loading: boolean
  deductCoin: () => Promise<void>
  addCoin: () => Promise<boolean>
  addCoins: (amount: number) => Promise<void>
  incrementGeneration: () => Promise<void>
  incrementCaptionGeneration: () => Promise<void>
  refreshCoins: () => Promise<void>
  captionGenerations: number
}

const FRSCContext = createContext<FRSCContextValue | null>(null)

export function FRSCProvider({ children }: { children: React.ReactNode }) {
  const frsc = useCoins()
  return <FRSCContext.Provider value={frsc}>{children}</FRSCContext.Provider>
}

export function useFRSC(): FRSCContextValue {
  const ctx = useContext(FRSCContext)
  if (!ctx) throw new Error('useFRSC must be used within FRSCProvider')
  return ctx
}
