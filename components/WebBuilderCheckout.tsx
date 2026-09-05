'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, ShieldCheck, CheckCircle, ArrowLeft, Package, FileText, CreditCard } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/ui/GoogleIcon'

interface OrderSummary {
  orderId: string
  packageName: string
  packageTier: string
  pages: number
  pricePerPageIdr: number
  normalPricePerPageIdr: number
  totalPriceIdr: number
  discountPercent: number
  name: string
  contact: string
  notes: string
  status: string
  createdAt: string
}

interface PaymentData {
  orderId: string
  signature: string
  totalAmount: string
  qrisUrl: string
  qrisImage: string
  expiredAt: string
  totalPriceIdr: number
}

const STATUS_LABELS: Record<string, { id: string; en: string }> = {
  pending_payment: { id: 'Menunggu Pembayaran', en: 'Awaiting Payment' },
  paid: { id: 'Sudah Dibayar', en: 'Paid' },
  processing: { id: 'Sedang Diproses', en: 'Processing' },
  completed: { id: 'Selesai', en: 'Completed' },
  cancelled: { id: 'Dibatalkan', en: 'Cancelled' },
}

function formatIdr(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`
}

export function WebBuilderCheckout({ orderId, initialLang }: { orderId: string; initialLang: string }) {
  const { user, loading: authLoading, signIn } = useAuthContext()
  const [lang] = useState(initialLang)
  const isId = lang === 'id'

  const [order, setOrder] = useState<OrderSummary | null>(null)
  const [orderLoading, setOrderLoading] = useState(true)
  const [orderError, setOrderError] = useState<string | null>(null)

  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)
  const [polling, setPolling] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchOrder = useCallback(async () => {
    if (!user) return
    setOrderLoading(true)
    setOrderError(null)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch(`/api/web-builder/order/${orderId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load order.')
      setOrder(data)
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Failed to load order.')
    } finally {
      setOrderLoading(false)
    }
  }, [user, orderId])

  useEffect(() => {
    if (user) fetchOrder()
  }, [user, fetchOrder])

  const startPolling = useCallback((payOrderId: string) => {
    setPolling(true)
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?order_id=${payOrderId}`)
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

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  async function handleCreatePayment() {
    if (!user || !order) return
    setPayLoading(true)
    setPayError(null)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch(`/api/web-builder/order/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment creation failed.')
      setPayment(data)
      startPolling(data.orderId)
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Payment creation failed.')
    } finally {
      setPayLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-frsc-crimson-400" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-frsc-crimson-800/20 ring-1 ring-frsc-crimson-500/30">
            <ShieldCheck className="h-6 w-6 text-frsc-crimson-400" />
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-frsc-white-bright">
            {isId ? 'Login untuk Melanjutkan' : 'Sign in to Continue'}
          </h1>
          <p className="mt-2 text-sm text-frsc-text-200">
            {isId
              ? 'Kamu perlu login untuk melakukan pembayaran pesanan website.'
              : 'You need to sign in to complete your website order payment.'}
          </p>
          <button
            type="button"
            onClick={signIn}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-[0.98]"
          >
            <GoogleIcon className="h-5 w-5" />
            {isId ? 'Masuk dengan Google' : 'Sign in with Google'}
          </button>
          <div className="mt-6">
            <Link href={`/${lang}/ai/website-builder`} className="text-sm text-frsc-text-300 hover:text-frsc-crimson-300 transition-colors">
              ← {isId ? 'Kembali ke Website Builder' : 'Back to Website Builder'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (orderLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-frsc-crimson-400" />
        <p className="mt-3 text-sm text-frsc-text-300">{isId ? 'Memuat pesanan...' : 'Loading order...'}</p>
      </div>
    )
  }

  if (orderError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-sm text-red-400">{orderError}</p>
          <Link href={`/${lang}/ai/website-builder`} className="mt-4 inline-block text-sm text-frsc-crimson-300 hover:text-frsc-crimson-200">
            ← {isId ? 'Kembali' : 'Go back'}
          </Link>
        </div>
      </div>
    )
  }

  if (!order) return null

  // Paid / completed state
  if (paid || order.status === 'paid' || order.status === 'processing' || order.status === 'completed') {
    const statusLabel = STATUS_LABELS[order.status]?.[lang as 'id' | 'en'] ?? order.status
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 ring-1 ring-green-500/30">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="mt-5 font-heading text-xl font-bold text-frsc-white-bright">
            {isId ? 'Pembayaran Berhasil!' : 'Payment Successful!'}
          </h1>
          <p className="mt-2 text-sm text-frsc-text-200">
            {isId
              ? `Pesanan #${order.orderId} sedang diproses.`
              : `Order #${order.orderId} is being processed.`}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm font-medium text-green-400">
            {statusLabel}
          </div>
          <div className="mt-6">
            <Link href={`/${lang}/ai/website-builder`} className="text-sm text-frsc-text-300 hover:text-frsc-crimson-300 transition-colors">
              ← {isId ? 'Kembali ke Website Builder' : 'Back to Website Builder'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Cancelled state
  if (order.status === 'cancelled') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-sm text-frsc-text-300">
            {isId ? 'Pesanan ini telah dibatalkan.' : 'This order has been cancelled.'}
          </p>
          <Link href={`/${lang}/ai/website-builder`} className="mt-4 inline-block text-sm text-frsc-crimson-300 hover:text-frsc-crimson-200">
            ← {isId ? 'Kembali' : 'Go back'}
          </Link>
        </div>
      </div>
    )
  }

  // Main checkout UI
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 px-4 py-10 lg:px-6">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link href={`/${lang}/ai/website-builder`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-frsc-text-300 transition-colors hover:text-frsc-crimson-300">
            <ArrowLeft className="h-3.5 w-3.5" />
            {isId ? 'Kembali ke Website Builder' : 'Back to Website Builder'}
          </Link>

          {/* Header */}
          <h1 className="font-heading text-2xl font-bold text-frsc-white-bright">
            {isId ? 'Selesaikan Pembayaran' : 'Complete Your Payment'}
          </h1>
          <p className="mt-1 text-sm text-frsc-text-200">
            {isId ? 'Pesanan Website Builder' : 'Website Builder Order'} · <span className="font-mono text-frsc-crimson-300">#{order.orderId}</span>
          </p>

          {/* Order Summary */}
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-5 shadow-metallic">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10">
                <Package className="h-4 w-4 text-frsc-crimson-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-frsc-white-bright">{order.packageName}</p>
                <p className="text-xs text-frsc-text-300">{isId ? 'Detail Pesanan' : 'Order Details'}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/[0.06] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-frsc-text-300">{isId ? 'Nama' : 'Name'}</span>
                <span className="text-frsc-text-100">{order.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-frsc-text-300">{isId ? 'WhatsApp' : 'WhatsApp'}</span>
                <span className="text-frsc-text-100">{order.contact}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-frsc-text-300">{isId ? 'Halaman' : 'Pages'}</span>
                <span className="text-frsc-text-100">{order.pages}</span>
              </div>
              {order.notes && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-frsc-text-300" />
                  <span className="text-frsc-text-200 leading-relaxed">{order.notes}</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-1 border-t border-white/[0.06] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-frsc-text-300">{order.packageName} × {order.pages}</span>
                <span className="text-frsc-text-100">{formatIdr(order.normalPricePerPageIdr * order.pages)}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-400">
                <span>{isId ? 'Diskon' : 'Discount'} ({order.discountPercent}%)</span>
                <span>-{formatIdr((order.normalPricePerPageIdr - order.pricePerPageIdr) * order.pages)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-white/[0.06]">
                <span className="text-frsc-white-bright">{isId ? 'Total' : 'Total'}</span>
                <span className="text-frsc-white-bright">{formatIdr(order.totalPriceIdr)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {payment ? (
            <PaymentSection
              payment={payment}
              paid={paid}
              polling={polling}
              isId={isId}
            />
          ) : (
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreatePayment}
                disabled={payLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {payLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isId ? 'Membuat QRIS...' : 'Generating QRIS...'}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    {isId ? 'Bayar dengan QRIS' : 'Pay with QRIS'} · {formatIdr(order.totalPriceIdr)}
                  </>
                )}
              </button>
              {payError && (
                <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-xs text-red-300">
                  {payError}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function PaymentSection({
  payment,
  paid,
  polling,
  isId,
}: {
  payment: PaymentData
  paid: boolean
  polling: boolean
  isId: boolean
}) {
  const [countdown, setCountdown] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!payment?.expiredAt) return
    const end = new Date(payment.expiredAt.replace(' ', 'T')).getTime()
    timerRef.current = setInterval(() => {
      const diff = end - Date.now()
      if (diff <= 0) {
        setCountdown('Expired')
        if (timerRef.current) clearInterval(timerRef.current)
      } else {
        const m = Math.floor(diff / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setCountdown(`${m}:${s.toString().padStart(2, '0')}`)
      }
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [payment?.expiredAt])

  if (paid) {
    return (
      <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
        <p className="mt-3 text-base font-bold text-green-400">
          {isId ? 'Pembayaran Diterima!' : 'Payment Received!'}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-5 shadow-metallic">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10">
          <CreditCard className="h-4 w-4 text-frsc-crimson-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-frsc-white-bright">
            {isId ? 'Pembayaran QRIS' : 'QRIS Payment'}
          </p>
          <p className="text-xs text-frsc-text-300">{isId ? 'Scan kode di bawah' : 'Scan the code below'}</p>
        </div>
      </div>

      {/* Total to Pay */}
      <div className="mb-4 rounded-xl border border-frsc-crimson-500/20 bg-frsc-crimson-900/10 p-4 text-center">
        <p className="text-xs text-frsc-text-300">{isId ? 'TOTAL YANG HARUS DIBAYAR' : 'TOTAL TO PAY'}</p>
        <p className="mt-1 font-heading text-2xl font-bold text-frsc-white-bright">
          Rp{Number(payment.totalAmount || 0).toLocaleString('id-ID')}
        </p>
      </div>

      {/* QR Code */}
      {(payment.qrisImage || payment.qrisUrl) && (
        <div className="mx-auto w-56 rounded-2xl border border-white/10 bg-white p-3 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={payment.qrisImage || payment.qrisUrl}
            alt="QRIS"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {/* Countdown */}
      {countdown && (
        <p className="mt-3 text-center text-xs text-frsc-text-300">
          {countdown === 'Expired'
            ? (isId ? 'QRIS kedaluwarsa — buat ulang' : 'QRIS expired — regenerate')
            : (isId ? `Sisa waktu: ${countdown}` : `Time remaining: ${countdown}`)}
        </p>
      )}

      {/* Status */}
      {polling && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-frsc-text-300">
          <span className="flex h-2 w-2 rounded-full bg-frsc-crimson-500 animate-pulse" />
          {isId ? 'Menunggu pembayaran...' : 'Waiting for payment...'}
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-frsc-text-300/60 leading-relaxed">
        {isId
          ? 'Scan QRIS dengan aplikasi pembayaran. Status akan diperbarui otomatis.'
          : 'Scan QRIS with your payment app. Status updates automatically.'}
      </p>
    </div>
  )
}
