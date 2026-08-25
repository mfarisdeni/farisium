'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Loader2, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuthContext } from '@/contexts/AuthContext'
import { useKlikQRIS } from '@/hooks/useKlikQRIS'
import { useLang } from '@/hooks/useLang'
import { useFRSC } from '@/contexts/FRSCContext'

interface SupportModalProps {
  open: boolean
  onClose: () => void
}

const tiers = [
  { amount: 10, price: 'Rp 10.000', perCoin: 'Rp 1.000/FRSC', popular: false },
  { amount: 30, price: 'Rp 25.000', perCoin: 'Rp 833/FRSC', popular: true },
  { amount: 75, price: 'Rp 50.000', perCoin: 'Rp 667/FRSC', popular: false },
  { amount: 200, price: 'Rp 100.000', perCoin: 'Rp 500/FRSC', popular: false },
]

export function SupportModal({ open, onClose }: SupportModalProps) {
  const { user, signIn } = useAuthContext()
  const { t } = useLang()
  const { refreshCoins } = useFRSC()
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [step, setStep] = useState<'select' | 'pay' | 'waiting' | 'success'>('select')

  const { createPayment, openSnap, startPolling, stopPolling, loading, paid, error, payment, reset } = useKlikQRIS({
    uid: user?.uid ?? '',
  })

  useEffect(() => {
    if (paid && step === 'waiting') {
      setStep('success')
      refreshCoins()
    }
  }, [paid, step, refreshCoins])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  if (!open) return null

  const handleSelectTier = (amount: number) => {
    setSelectedTier(amount)
    setStep('pay')
    reset()
  }

  const handlePayIDR = async () => {
    if (!selectedTier || !user) return
    const p = await createPayment(selectedTier)
    if (p) {
      setStep('waiting')
      startPolling(p.orderId)
    }
  }

  const handleBack = () => {
    setStep('select')
    setSelectedTier(null)
    reset()
  }

  const handleClose = () => {
    stopPolling()
    reset()
    setStep('select')
    setSelectedTier(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden="true"
      />

      <Card variant="glass" className="relative z-10 w-full max-w-sm border border-white/10 p-0 shadow-2xl animate-fade-in overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-20 -top-40 opacity-30">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-frsc-crimson-500/20 blur-[80px]" />
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 rounded-lg p-1.5 text-frsc-text-300/50 transition-colors hover:text-frsc-text-100"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {step === 'select' && (
          <SelectStep
            tiers={tiers}
            user={!!user}
            signIn={signIn}
            onSelect={handleSelectTier}
            onClose={handleClose}
            t={t}
          />
        )}

        {step === 'pay' && (
          <PayStep
            selectedTier={selectedTier!}
            loading={loading}
            error={error}
            user={!!user}
            onPayIDR={handlePayIDR}
            onBack={handleBack}
            t={t}
          />
        )}

        {step === 'waiting' && (
          <WaitingStep
            selectedTier={selectedTier!}
            payment={payment}
            onClose={handleClose}
          />
        )}

        {step === 'success' && (
          <SuccessStep
            selectedTier={selectedTier!}
            onClose={handleClose}
          />
        )}
      </Card>
    </div>
  )
}

/* ── Step 1: Select Package (or Login) ── */
function SelectStep({
  tiers,
  user,
  signIn,
  onSelect,
  onClose,
  t,
}: {
  tiers: Array<{ amount: number; price: string; perCoin: string; popular: boolean }>
  user: boolean
  signIn: () => Promise<void>
  onSelect: (amount: number) => void
  onClose: () => void
  t: ReturnType<typeof useLang>['t']
}) {
  const [loggingIn, setLoggingIn] = useState(false)

  const handleLogin = async () => {
    setLoggingIn(true)
    await signIn()
    setLoggingIn(false)
  }

  const handleTierClick = (amount: number) => {
    if (!user) {
      handleLogin()
      return
    }
    onSelect(amount)
  }

  return (
    <div className="relative z-10 px-5 py-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center">
          <div className="relative">
            <Image src="/farisium-coin.png" alt="FRSC" width={64} height={64} className="h-16 w-16 object-contain drop-shadow-[0_0_20px_rgba(224,48,78,0.3)]" />
            <div aria-hidden="true" className="absolute -inset-2 rounded-full bg-frsc-crimson-500/10 blur-xl" />
          </div>
        </div>
        <h2 id="support-title" className="mt-4 text-xl font-bold text-frsc-white-bright">+FRSC</h2>
        <p className="mt-1.5 text-sm text-frsc-text-200 leading-relaxed">{t('topupSubtitle') as string}</p>
      </div>

      <div className="mt-6 grid gap-2.5">
        {tiers.map((tier) => (
          <button
            key={tier.amount}
            type="button"
            onClick={() => handleTierClick(tier.amount)}
            className="group relative flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-2.5 text-left transition-all duration-300 hover:border-frsc-crimson-500/40 hover:from-frsc-crimson-900/10 hover:to-frsc-crimson-900/5 hover:shadow-[0_0_24px_rgba(224,48,78,0.06)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/25 to-frsc-purple-800/15 ring-1 ring-white/10 transition-all duration-300 group-hover:from-frsc-crimson-800/40 group-hover:to-frsc-purple-800/25 group-hover:ring-frsc-crimson-500/30">
                <Image src="/farisium-coin.png" alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
              </div>
              <div>
                <span className="text-sm font-bold text-frsc-white-bright">{tier.amount} FRSC</span>
                <span className="block pl-2 text-[11px] text-frsc-text-300">{tier.perCoin}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              {tier.popular && <Badge variant="crimson" size="sm">Best Value</Badge>}
              <span className="text-sm font-bold text-frsc-crimson-400">{tier.price}</span>
            </div>
          </button>
        ))}
      </div>

      {!user && (
        <>
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-frsc-text-300/50">
                Masuk untuk membeli FRSC
              </span>
            </div>
          </div>

          <LoginPrompt loggingIn={loggingIn} onLogin={handleLogin} />
        </>
      )}

      {user && (
        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-frsc-text-300">
          <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-frsc-crimson-400" />Secure Payment</span>
          <span className="flex items-center gap-1.5">
            <svg className="size-3.5 text-frsc-crimson-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="size-3.5 text-frsc-crimson-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
            KlikQRIS
          </span>
        </div>
      )}

      <Button variant="ghost" size="sm" onClick={onClose} className="mt-4 w-full text-frsc-text-300">
        {user ? 'Cancel' : 'Tutup'}
      </Button>
    </div>
  )
}

/* ── Login Prompt ── */
function LoginPrompt({ loggingIn, onLogin }: { loggingIn: boolean; onLogin: () => void }) {
  return (
    <div>
      <button
        type="button"
        disabled={loggingIn}
        onClick={onLogin}
        className="group inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-white px-8 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loggingIn ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            <img
              src="/google.jpg"
              alt="Google"
              className="h-6 w-6 shrink-0"
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-black">Masuk dengan Google</span>
              <span className="text-[11px] font-normal text-black">+1 FREE FRSC</span>
            </div>
          </>
        )}
      </button>
    </div>
  )
}

/* ── Step 2: Choose Payment ── */
function PayStep({
  selectedTier,
  loading,
  error,
  user,
  onPayIDR,
  onBack,
  t,
}: {
  selectedTier: number
  loading: boolean
  error: string | null
  user: boolean
  onPayIDR: () => void
  onBack: () => void
  t: ReturnType<typeof useLang>['t']
}) {
  return (
    <div className="relative z-10 p-6">
      <button type="button" onClick={onBack} className="absolute left-3 top-3 z-20 rounded-lg p-1.5 text-frsc-text-300/50 transition-colors hover:text-frsc-text-100" aria-label="Back">
        <ArrowLeft className="size-4" />
      </button>

      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center">
          <div className="relative">
            <Image src="/farisium-coin.png" alt="FRSC" width={64} height={64} className="h-16 w-16 object-contain drop-shadow-[0_0_20px_rgba(224,48,78,0.3)]" />
            <div aria-hidden="true" className="absolute -inset-2 rounded-full bg-frsc-crimson-500/10 blur-xl" />
          </div>
        </div>
        <h2 className="mt-3 text-xl font-bold text-frsc-white-bright">{selectedTier} FRSC</h2>
        <p className="mt-1 text-sm text-frsc-text-200">{t('choosePayment') as string}</p>
      </div>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          disabled={loading || !user}
          onClick={onPayIDR}
          className="group relative flex w-full items-center justify-between rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-frsc-surface-800 p-4 text-left transition-all duration-300 hover:border-frsc-crimson-500/40 hover:from-frsc-crimson-900/10 hover:to-frsc-crimson-900/5 hover:shadow-[0_0_24px_rgba(224,48,78,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10 bg-white p-2">
              <Image src="/qris-logo.jpeg" alt="QRIS" width={32} height={32} className="h-full w-full object-contain" />
            </span>
            <div>
              <span className="text-base font-bold text-frsc-white-bright group-hover:text-frsc-crimson-300 transition-colors">IDR — QRIS</span>
              <p className="text-xs text-frsc-text-300">Instant payment via QRIS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-frsc-crimson-400" />
            ) : (
              <>
                <span className="text-xs font-semibold text-frsc-crimson-400 opacity-0 group-hover:opacity-100 transition-opacity">Beli</span>
                <svg className="size-4 text-frsc-text-300 group-hover:text-frsc-crimson-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </>
            )}
          </div>
        </button>

        <button type="button" disabled className="group relative flex w-full items-center justify-between rounded-2xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-frsc-surface-800/50 p-4 text-left opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/5 bg-frsc-surface-700">
              <Image src="/usdc.png" alt="USDC" width={28} height={28} className="h-7 w-7 object-contain opacity-50" />
            </span>
            <div>
              <span className="text-base font-bold text-frsc-text-200">USDC Polygon</span>
              <p className="text-xs text-frsc-text-300/60">Dalam Pengembangan</p>
            </div>
          </div>
        </button>
      </div>

      {error && <p className="mt-3 text-center text-xs text-destructive bg-destructive/10 rounded-lg p-2.5">{error}</p>}
    </div>
  )
}

/* ── Step 3: Waiting for Payment ── */
function WaitingStep({ selectedTier, payment, onClose }: {
  selectedTier: number
  payment: {
    totalAmount?: string
    qrisImage?: string
    qrisUrl?: string
    expiredAt?: string
  } | null
  onClose: () => void
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
        timerRef.current && clearInterval(timerRef.current)
      } else {
        const m = Math.floor(diff / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setCountdown(`${m}:${s.toString().padStart(2, '0')}`)
      }
    }, 1000)
    return () => { timerRef.current && clearInterval(timerRef.current) }
  }, [payment?.expiredAt])

  return (
    <div className="relative z-10 p-6 text-center">
      <h2 className="text-lg font-bold text-frsc-white-bright">Scan QRIS</h2>
      <p className="mt-1 text-sm text-frsc-text-200">
        Bayar <span className="font-semibold text-frsc-crimson-300">Rp{Number(payment?.totalAmount || 0).toLocaleString('id-ID')}</span>
      </p>

      {payment?.qrisImage && (
        <div className="mx-auto mt-4 w-56 rounded-2xl border border-white/10 bg-white p-3 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={payment.qrisImage}
            alt="QRIS"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {payment?.qrisUrl && !payment?.qrisImage && (
        <div className="mx-auto mt-4 w-56 rounded-2xl border border-white/10 bg-white p-3 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={payment.qrisUrl}
            alt="QRIS"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {countdown && (
        <p className="mt-3 text-xs text-frsc-text-300">
          {countdown === 'Expired' ? 'Pembayaran kedaluwarsa' : `Sisa waktu: ${countdown}`}
        </p>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-frsc-text-300">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-frsc-crimson-500 animate-pulse" />
          Menunggu pembayaran...
        </div>
      </div>

      <p className="mt-3 text-[11px] text-frsc-text-300/60 leading-relaxed px-2">
        Scan QRIS dengan aplikasi pembayaran lalu lakukan pembayaran.
        Status akan diperbarui otomatis.
      </p>

      <Button variant="ghost" size="sm" onClick={onClose} className="mt-4 text-frsc-text-300">
        Tutup
      </Button>
    </div>
  )
}

/* ── Step 4: Success ── */
function SuccessStep({ selectedTier, onClose }: { selectedTier: number; onClose: () => void }) {
  return (
    <div className="relative z-10 p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 ring-1 ring-green-500/30">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <div aria-hidden="true" className="absolute -inset-3 rounded-full bg-green-500/10 blur-xl" />
        </div>
      </div>

      <h2 className="mt-5 text-xl font-bold text-frsc-white-bright">Pembayaran Berhasil!</h2>
      <p className="mt-2 text-sm text-frsc-text-200">
        <span className="font-bold text-frsc-crimson-300">{selectedTier} FRSC</span> berhasil ditambahkan ke akun kamu.
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
        <Image src="/farisium-coin.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
        <span className="text-lg font-bold text-green-400">+{selectedTier} FRSC</span>
      </div>

      <Button
        variant="crimson-gradient"
        size="lg"
        onClick={onClose}
        className="mt-6 w-full"
      >
        Lanjutkan
      </Button>
    </div>
  )
}
