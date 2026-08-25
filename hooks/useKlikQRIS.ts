'use client'

import { useState, useCallback, useRef } from 'react'
import { getKlikQRISSnapURL } from '@/lib/klikqris-config'

interface KlikQRISOptions {
  uid: string
}

interface PaymentData {
  orderId: string
  signature: string
  totalAmount: string
  qrisUrl: string
  qrisImage: string
  expiredAt: string
}

export function useKlikQRIS({ uid }: KlikQRISOptions) {
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const createPayment = useCallback(async (amount: number): Promise<PaymentData | null> => {
    setLoading(true)
    setError(null)
    setPayment(null)
    setPaid(false)

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, amount }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Payment creation failed')
      }

      setPayment(data)
      return data
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment error'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [uid])

  const btnRef = useRef<HTMLButtonElement | null>(null)

  const openSnap = useCallback((signature: string) => {
    document.getElementById('btnPay')?.remove()

    const btn = document.createElement('button')
    btn.id = 'btnPay'
    btn.setAttribute('data-signature', signature)
    btn.style.display = 'none'
    document.body.appendChild(btn)
    btnRef.current = btn

    const script = document.createElement('script')
    script.src = `${getKlikQRISSnapURL()}&t=${Date.now()}`
    script.onload = () => setTimeout(() => btn.click(), 500)
    document.body.appendChild(script)
  }, [])

  const startPolling = useCallback((orderId: string) => {
    setPolling(true)

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?order_id=${orderId}`)
        const data = await res.json()

        if (data.status === 'PAID' || data.status === 'SUCCESS') {
          setPaid(true)
          setPolling(false)
          if (pollRef.current) {
            clearInterval(pollRef.current)
            pollRef.current = null
          }
        }
      } catch {
        // silently retry
      }
    }, 3000)
  }, [])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    setPolling(false)
  }, [])

  const reset = useCallback(() => {
    stopPolling()
    btnRef.current?.remove()
    btnRef.current = null
    setPayment(null)
    setError(null)
    setLoading(false)
    setPaid(false)
    setPolling(false)
  }, [stopPolling])

  return { createPayment, openSnap, startPolling, stopPolling, loading, polling, paid, error, payment, reset }
}
