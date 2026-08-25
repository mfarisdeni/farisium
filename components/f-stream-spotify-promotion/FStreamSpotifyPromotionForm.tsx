'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import Image from 'next/image'
import { useAuthContext } from '@/contexts/AuthContext'
import { useLang } from '@/hooks/useLang'
import { useFRSC } from '@/contexts/FRSCContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { CheckCircle, Loader2, AlertCircle, ShoppingBag, X, Clock } from 'lucide-react'

interface FormData {
  artistName: string
  genre: string
  spotifyUrl: string
  contact: string
  paymentMethod: string
  packageTier: 'paket-1' | 'paket-2'
}

const initialForm: FormData = {
  artistName: '',
  genre: '',
  spotifyUrl: '',
  contact: '',
  paymentMethod: 'IDR',
  packageTier: 'paket-1',
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string }

type PaymentStep =
  | 'idle'
  | 'confirm_payment'
  | 'creating_payment'
  | 'show_qris'
  | 'paid'
  | 'payment_error'

interface PaymentData {
  orderId: string
  signature: string
  totalAmount: string
  qrisUrl: string
  qrisImage: string
  expiredAt: string
}

const packages = {
  'paket-1': { name: 'Paket 1', priceIdr: 'Rp299.000', priceFrsc: '600 FRSC' },
  'paket-2': { name: 'Paket 2', priceIdr: 'Rp399.000', priceFrsc: '800 FRSC' },
}

const content = {
  id: {
    title: 'Mulai Kampanye Spotify-mu',
    sub: 'Isi detail untuk memulai',
    successTitle: 'Pesanan Berhasil Dikirim',
    successDesc:
      'Pesanan F-Stream Boost-mu telah dikirim. Farisium akan mereview kampanye dan menghubungimu segera.',
    submitAnother: 'Kirim Pesanan Lain',
    artistName: 'Nama Artis',
    artistPlaceholder: 'Nama artis kamu',
    genre: 'Genre',
    genrePlaceholder: 'Contoh: Pop, Hip-Hop, EDM',
    spotifyUrl: 'URL Track Spotify',
    spotifyPlaceholder: 'https://open.spotify.com/track/...',
    contact: 'Kontak Email / WhatsApp',
    contactPlaceholder: 'email@example.com atau +62xxx',
    paymentMethod: 'Metode Pembayaran',
    packageLabel: 'Pilih Paket',
    package1Desc: '1.000+ streams, 300+ listeners',
    package2Desc: '3.000+ streams, 600+ listeners',
    submit: 'Mulai Kampanye Spotify',
    submitting: 'Mengirim...',
    terms: 'Dengan mengirim, kamu menyetujui syarat dan ketentuan kampanye Farisium.',
    errorRequired: 'harus diisi.',
    errorSpotifyUrl: 'URL Spotify harus berupa link track yang valid (mengandung spotify.com dan /track/).',
    errorSubmit: 'Gagal mengirim pesanan. Silakan coba lagi.',
    errorLogin: 'Silakan login terlebih dahulu.',
    errorCoins: 'FRSC tidak mencukupi. Isi ulang FRSC di halaman Dashboard.',
    // Payment modal
    payTitle: 'Bayar dengan QRIS',
    payAmount: 'Total Pembayaran',
    payScan: 'Scan QRIS dengan aplikasi pembayaran kamu',
    payWaiting: 'Menunggu pembayaran...',
    paySuccess: 'Pembayaran Berhasil!',
    paySuccessDesc: 'Kampanye akan segera diproses oleh tim Farisium.',
    payExpired: 'Kedaluwarsa',
    payRemaining: 'Sisa waktu',
    payError: 'Gagal membuat pembayaran.',
    payRetry: 'Coba Lagi',
    payClose: 'Tutup',
    payCreating: 'Menyiapkan pembayaran...',
    // Confirmation invoice
    confirmTitle: 'Konfirmasi Pesanan',
    confirmPackage: 'Paket',
    confirmTarget: 'Target Kampanye',
    confirmPrice: 'Total Harga',
    confirmUniqueDigits:
      'Nanti di halaman QRIS, total tagihan akan bertambah 3 digit angka unik (contoh: Rp299.000 → Rp299.472). Tiga digit terakhir adalah kode identifikasi transaksi. Kamu wajib membayar sesuai nominal yang tertera di halaman QRIS, bukan nominal di atas.',
    confirmContinue: 'Lanjutkan Pembayaran',
    confirmCancel: 'Batalkan',
    confirmStreams: 'Streams Target',
    confirmListeners: 'Listeners Target',
    confirmDuration: 'Estimasi Durasi',
  },
  en: {
    title: 'Start Your Spotify Campaign',
    sub: 'Fill in your details to begin',
    successTitle: 'Order Submitted Successfully',
    successDesc:
      'Your F-Stream Boost order has been submitted. Farisium will review your campaign and contact you soon.',
    submitAnother: 'Submit Another Order',
    artistName: 'Artist Name',
    artistPlaceholder: 'Your artist name',
    genre: 'Genre',
    genrePlaceholder: 'e.g. Pop, Hip-Hop, EDM',
    spotifyUrl: 'Spotify Track URL',
    spotifyPlaceholder: 'https://open.spotify.com/track/...',
    contact: 'Contact Email / WhatsApp',
    contactPlaceholder: 'email@example.com or +62xxx',
    paymentMethod: 'Payment Method',
    packageLabel: 'Select Package',
    package1Desc: '1,000+ streams, 300+ listeners',
    package2Desc: '3,000+ streams, 600+ listeners',
    submit: 'Start Spotify Campaign',
    submitting: 'Submitting...',
    terms: "By submitting, you agree to Farisium's campaign terms and conditions.",
    errorRequired: 'is required.',
    errorSpotifyUrl: 'Spotify Track URL must be a valid track link (containing spotify.com and /track/).',
    errorSubmit: 'Failed to submit your order. Please try again.',
    errorLogin: 'Please login first.',
    errorCoins: 'Insufficient FRSC. Top up FRSC on the Dashboard page.',
    // Payment modal
    payTitle: 'Pay with QRIS',
    payAmount: 'Total Payment',
    payScan: 'Scan QRIS with your payment app',
    payWaiting: 'Waiting for payment...',
    paySuccess: 'Payment Successful!',
    paySuccessDesc: 'Your campaign will be processed by the Farisium team shortly.',
    payExpired: 'Expired',
    payRemaining: 'Time remaining',
    payError: 'Failed to create payment.',
    payRetry: 'Try Again',
    payClose: 'Close',
    payCreating: 'Preparing payment...',
    // Confirmation invoice
    confirmTitle: 'Confirm Order',
    confirmPackage: 'Package',
    confirmTarget: 'Campaign Target',
    confirmPrice: 'Total Price',
    confirmUniqueDigits:
      'On the QRIS page, the total bill will be increased by 3 unique digits (e.g. Rp299.000 → Rp299.472). The last 3 digits are a transaction identification code. You must pay the exact amount shown on the QRIS page, not the amount above.',
    confirmContinue: 'Continue to Payment',
    confirmCancel: 'Cancel',
    confirmStreams: 'Streams Target',
    confirmListeners: 'Listeners Target',
    confirmDuration: 'Est. Duration',
  },
}

export function FStreamSpotifyPromotionForm() {
  const { user } = useAuthContext()
  const { lang } = useLang()
  const { coins, refreshCoins } = useFRSC()
  const c = content[lang] ?? content.id
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('idle')
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pkg = packages[form.packageTier]
  const isIdr = form.paymentMethod === 'IDR'

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [])

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  const startPolling = (orderId: string) => {
    stopPolling()
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/f-stream-spotify-promotion/status?order_id=${orderId}`)
        const data = await res.json()
        if (data.status === 'PAID' || data.status === 'SUCCESS') {
          stopPolling()
          setPaymentStep('paid')
          setSubmitState({ status: 'success' })
          setForm(initialForm)
        }
      } catch {
        // silently retry
      }
    }, 3000)
  }

  const closePaymentModal = () => {
    stopPolling()
    setPaymentStep('idle')
    setPaymentData(null)
    setPaymentError(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = (): string | null => {
    if (!form.artistName.trim()) return `${c.artistName} ${c.errorRequired}`
    if (!form.genre.trim()) return `${c.genre} ${c.errorRequired}`
    if (!form.spotifyUrl.trim()) return `${c.spotifyUrl} ${c.errorRequired}`
    if (
      !form.spotifyUrl.includes('spotify.com') ||
      !form.spotifyUrl.includes('/track/')
    )
      return c.errorSpotifyUrl
    if (!form.contact.trim()) return `${c.contact} ${c.errorRequired}`
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      setSubmitState({ status: 'error', message: error })
      return
    }

    if (!user) {
      setSubmitState({ status: 'error', message: c.errorLogin })
      return
    }

    if (form.paymentMethod === 'IDR') {
      // IDR Payment: show confirmation first
      setSubmitState({ status: 'idle' })
      setPaymentStep('confirm_payment')
      setPaymentError(null)
    } else {
      // FRSC Payment: check coins, call order API
      if (coins < (form.packageTier === 'paket-2' ? 800 : 600)) {
        setSubmitState({ status: 'error', message: c.errorCoins })
        return
      }

      setSubmitState({ status: 'loading' })

      try {
        const res = await fetch('/api/f-stream-spotify-promotion/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            userEmail: user.email ?? null,
            artistName: form.artistName.trim(),
            genre: form.genre.trim(),
            spotifyUrl: form.spotifyUrl.trim(),
            contact: form.contact.trim(),
            paymentMethod: form.paymentMethod,
            packageTier: form.packageTier,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setSubmitState({
            status: 'error',
            message: data.error || (lang === 'id' ? 'Gagal mengirim pesanan.' : 'Failed to submit your order.'),
          })
          return
        }

        await refreshCoins()
        setSubmitState({ status: 'success' })
        setForm(initialForm)
      } catch {
        setSubmitState({ status: 'error', message: c.errorSubmit })
      }
    }
  }

  const handleConfirmPayment = async () => {
    if (!user) return
    setPaymentStep('creating_payment')

    try {
      const res = await fetch('/api/f-stream-spotify-promotion/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          userEmail: user.email ?? null,
          artistName: form.artistName.trim(),
          genre: form.genre.trim(),
          spotifyUrl: form.spotifyUrl.trim(),
          contact: form.contact.trim(),
          paymentMethod: form.paymentMethod,
          packageTier: form.packageTier,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setPaymentError(data.error || c.payError)
        setPaymentStep('payment_error')
        return
      }

      setPaymentData(data)
      setPaymentStep('show_qris')
      startPolling(data.orderId)
    } catch {
      setPaymentError(c.payError)
      setPaymentStep('payment_error')
    }
  }

  if (submitState.status === 'success' && paymentStep !== 'paid') {
    return (
      <GlassCard
        variant="premium"
        blur="medium"
        withReflection
        withAccent="crimson"
        className="p-10 text-center"
      >
        <div className="relative z-[2]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 ring-1 ring-green-500/30">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-frsc-white-bright">
            {c.successTitle}
          </h3>
          <p className="mx-auto max-w-md text-sm text-frsc-text-200">
            {c.successDesc}
          </p>
          <button
            type="button"
            onClick={() => setSubmitState({ status: 'idle' })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-frsc-text-200 transition-all duration-300 hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-400 active:scale-[0.97]"
          >
            {c.submitAnother}
          </button>
        </div>
      </GlassCard>
    )
  }

  return (
    <>
      <GlassCard
        variant="premium"
        blur="medium"
        withReflection
        withAccent="purple"
        className={`p-6 md:p-8 ${paymentStep !== 'idle' ? 'opacity-40 pointer-events-none' : ''}`}
      >
        <div className="relative z-[2]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-500/30">
              <ShoppingBag className="h-5 w-5 text-frsc-crimson-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-frsc-white-bright">
                {c.title}
              </h3>
              <p className="text-xs text-frsc-text-200">{c.sub}</p>
            </div>
          </div>

          {submitState.status === 'error' && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{submitState.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Package selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-frsc-text-200">
                {c.packageLabel} <span className="text-frsc-crimson-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['paket-1', 'paket-2'] as const).map((tier) => {
                  const p = packages[tier]
                  const active = form.packageTier === tier
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, packageTier: tier }))
                      }}
                      className={`rounded-xl border p-3 text-left transition-all duration-300 ${
                        active
                          ? 'border-frsc-crimson-500/40 bg-frsc-crimson-800/20 ring-1 ring-frsc-crimson-500/20'
                          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          active ? 'text-frsc-crimson-400' : 'text-frsc-text-200'
                        }`}
                      >
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs text-frsc-text-300/60">
                        {tier === 'paket-1'
                          ? c.package1Desc
                          : c.package2Desc}
                      </p>
                      <p
                        className={`mt-1 text-xs font-bold ${
                          active
                            ? 'text-frsc-white-bright'
                            : 'text-frsc-text-300/60'
                        }`}
                      >
                        {isIdr ? p.priceIdr : p.priceFrsc}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="artistName"
                  className="mb-1.5 block text-xs font-medium text-frsc-text-200"
                >
                  {c.artistName} <span className="text-frsc-crimson-400">*</span>
                </label>
                <input
                  id="artistName"
                  name="artistName"
                  type="text"
                  value={form.artistName}
                  onChange={handleChange}
                  placeholder={c.artistPlaceholder}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-frsc-white-bright placeholder:text-frsc-text-300/50 transition-all duration-300 focus:border-frsc-crimson-500/40 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="genre"
                  className="mb-1.5 block text-xs font-medium text-frsc-text-200"
                >
                  {c.genre} <span className="text-frsc-crimson-400">*</span>
                </label>
                <input
                  id="genre"
                  name="genre"
                  type="text"
                  value={form.genre}
                  onChange={handleChange}
                  placeholder={c.genrePlaceholder}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-frsc-white-bright placeholder:text-frsc-text-300/50 transition-all duration-300 focus:border-frsc-crimson-500/40 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="spotifyUrl"
                className="mb-1.5 block text-xs font-medium text-frsc-text-200"
              >
                {c.spotifyUrl} <span className="text-frsc-crimson-400">*</span>
              </label>
              <input
                id="spotifyUrl"
                name="spotifyUrl"
                type="url"
                value={form.spotifyUrl}
                onChange={handleChange}
                placeholder={c.spotifyPlaceholder}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-frsc-white-bright placeholder:text-frsc-text-300/50 transition-all duration-300 focus:border-frsc-crimson-500/40 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contact"
                className="mb-1.5 block text-xs font-medium text-frsc-text-200"
              >
                {c.contact} <span className="text-frsc-crimson-400">*</span>
              </label>
              <input
                id="contact"
                name="contact"
                type="text"
                value={form.contact}
                onChange={handleChange}
                placeholder={c.contactPlaceholder}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-frsc-white-bright placeholder:text-frsc-text-300/50 transition-all duration-300 focus:border-frsc-crimson-500/40 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/20"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="mb-1.5 block text-xs font-medium text-frsc-text-200"
                >
                  {c.paymentMethod} <span className="text-frsc-crimson-400">*</span>
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-frsc-white-bright transition-all duration-300 focus:border-frsc-crimson-500/40 focus:outline-none focus:ring-1 focus:ring-frsc-crimson-500/20"
                  required
                >
                  <option value="IDR" className="bg-frsc-surface-900">
                    IDR - {pkg.priceIdr}
                  </option>
                  <option value="FRSC" className="bg-frsc-surface-900">
                    FRSC - {pkg.priceFrsc}
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs text-frsc-text-300/50">
                  {lang === 'id'
                    ? `Harga spesial: ${pkg.priceFrsc} = ${pkg.priceIdr} saat payment.`
                    : `Special price: ${pkg.priceFrsc} = ${pkg.priceIdr} at payment.`}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitState.status === 'loading'}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-3 text-sm font-semibold text-white shadow-lg shadow-frsc-crimson-900/30 transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_28px_rgba(224,48,78,0.3)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60"
            >
              {submitState.status === 'loading' ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {c.submitting}
                </span>
              ) : (
                c.submit
              )}
            </button>

            <p className="text-center text-[11px] text-frsc-text-300/60">
              {c.terms}
            </p>
          </form>
        </div>
      </GlassCard>

      {/* Payment Modal */}
      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={
                paymentStep === 'confirm_payment' || paymentStep === 'creating_payment' || paymentStep === 'paid'
                  ? undefined
                  : closePaymentModal
              }
              aria-hidden="true"
            />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-b from-frsc-surface-800 to-frsc-surface-900 p-6 shadow-2xl animate-fade-in overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-20 -top-40 opacity-30">
              <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-frsc-crimson-500/20 blur-[80px]" />
            </div>

            {(paymentStep === 'confirm_payment') && (
              <PaymentConfirmView
                form={form}
                lang={lang}
                c={c}
                onConfirm={handleConfirmPayment}
                onCancel={closePaymentModal}
              />
            )}

            {(paymentStep === 'creating_payment') && (
              <div className="relative z-10 text-center py-8">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-frsc-crimson-400" />
                <p className="mt-4 text-sm text-frsc-text-200">{c.payCreating}</p>
              </div>
            )}

            {(paymentStep === 'show_qris') && paymentData && (
              <PaymentQRISView
                paymentData={paymentData}
                lang={lang}
                c={c}
                onClose={closePaymentModal}
              />
            )}

            {(paymentStep === 'paid') && (
              <PaymentSuccessView
                lang={lang}
                c={c}
                onClose={closePaymentModal}
              />
            )}

            {(paymentStep === 'payment_error') && (
              <PaymentErrorView
                error={paymentError}
                lang={lang}
                c={c}
                onRetry={() => handleSubmit(new Event('submit') as unknown as FormEvent)}
                onClose={closePaymentModal}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

/* ── Payment Confirmation Invoice View ── */
function PaymentConfirmView({
  form,
  lang,
  c,
  onConfirm,
  onCancel,
}: {
  form: FormData
  lang: string
  c: Record<string, string>
  onConfirm: () => void
  onCancel: () => void
}) {
  const pkg = packages[form.packageTier]
  const streamCount = form.packageTier === 'paket-2' ? '3,000+' : '1,000+'
  const listenerCount = form.packageTier === 'paket-2' ? '600+' : '300+'

  return (
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-frsc-white-bright">{c.confirmTitle}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1.5 text-frsc-text-300/50 transition-colors hover:text-frsc-text-100"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-frsc-text-300">{c.confirmPackage}</span>
          <span className="text-sm font-semibold text-frsc-white-bright">{pkg.name}</span>
        </div>

        <div className="border-t border-white/[0.06] pt-3">
          <p className="text-xs text-frsc-text-300 mb-2">{c.confirmTarget}</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-frsc-text-200">{c.confirmStreams}</span>
              <span className="font-medium text-frsc-white-bright">{streamCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-frsc-text-200">{c.confirmListeners}</span>
              <span className="font-medium text-frsc-white-bright">{listenerCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-frsc-text-200">{c.confirmDuration}</span>
              <span className="font-medium text-frsc-white-bright">7–10 days</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-frsc-text-200">{c.confirmPrice}</span>
            <span className="text-lg font-bold text-frsc-crimson-400">{pkg.priceIdr}</span>
          </div>
          <p className="mt-1.5 text-[11px] text-frsc-text-300/60">
            {lang === 'id'
              ? `Estimasi nominal transfer: ${pkg.priceIdr} – Rp${form.packageTier === 'paket-2' ? '399.999' : '299.999'}`
              : `Estimated transfer amount: ${pkg.priceIdr} – Rp${form.packageTier === 'paket-2' ? '399.999' : '299.999'}`}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-frsc-crimson-500/20 bg-frsc-crimson-500/5 p-3 text-xs text-frsc-text-200 leading-relaxed">
        {c.confirmUniqueDigits}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm font-medium text-frsc-text-200 transition-all duration-300 hover:border-white/[0.15] active:scale-[0.97]"
        >
          {c.confirmCancel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-3 text-sm font-semibold text-white shadow-lg shadow-frsc-crimson-900/30 transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_28px_rgba(224,48,78,0.3)] active:scale-[0.97]"
        >
          {c.confirmContinue}
        </button>
      </div>
    </div>
  )
}

/* ── Payment QRIS View ── */
function PaymentQRISView({
  paymentData,
  lang,
  c,
  onClose,
}: {
  paymentData: PaymentData
  lang: string
  c: Record<string, string>
  onClose: () => void
}) {
  const [countdown, setCountdown] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!paymentData.expiredAt) return
    const raw = paymentData.expiredAt.replace(' ', 'T')
    const end = new Date(raw).getTime()
    if (isNaN(end)) return

    timerRef.current = setInterval(() => {
      const diff = end - Date.now()
      if (diff <= 0) {
        setCountdown(c.payExpired)
        timerRef.current && clearInterval(timerRef.current)
      } else {
        const m = Math.floor(diff / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        setCountdown(`${m}:${s.toString().padStart(2, '0')}`)
      }
    }, 1000)
    return () => { timerRef.current && clearInterval(timerRef.current) }
  }, [paymentData.expiredAt, c.payExpired])

  return (
    <div className="relative z-10 text-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-0 top-0 z-20 rounded-lg p-1.5 text-frsc-text-300/50 transition-colors hover:text-frsc-text-100"
        aria-label="Close"
      >
        <X className="size-4" />
      </button>

      <h3 className="text-lg font-bold text-frsc-white-bright">{c.payTitle}</h3>

      <p className="mt-1 text-sm text-frsc-text-200">
        {c.payAmount}: <span className="font-semibold text-frsc-crimson-300">Rp{Number(paymentData.totalAmount).toLocaleString('id-ID')}</span>
      </p>
      <p className="mt-0.5 text-[10px] text-frsc-text-300/50">
        {lang === 'id'
          ? '3 digit terakhir adalah kode identifikasi transaksi'
          : 'Last 3 digits are transaction identification code'}
      </p>

      {paymentData.qrisImage && (
        <div className="mx-auto mt-4 w-56 rounded-2xl border border-white/10 bg-white p-3 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={paymentData.qrisImage}
            alt="QRIS"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {paymentData.qrisUrl && !paymentData.qrisImage && (
        <div className="mx-auto mt-4 w-56 rounded-2xl border border-white/10 bg-white p-3 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={paymentData.qrisUrl}
            alt="QRIS"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {countdown && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-frsc-text-300">
          <Clock className="size-3.5" />
          <span>
            {countdown === c.payExpired
              ? c.payExpired
              : `${c.payRemaining}: ${countdown}`}
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-frsc-text-300">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-frsc-crimson-500 animate-pulse" />
          {c.payWaiting}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-frsc-text-300/60 leading-relaxed px-2">
        {c.payScan}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 text-xs text-frsc-text-300/60 hover:text-frsc-text-100 transition-colors"
      >
        {c.payClose}
      </button>
    </div>
  )
}

/* ── Payment Success View ── */
function PaymentSuccessView({
  lang,
  c,
  onClose,
}: {
  lang: string
  c: Record<string, string>
  onClose: () => void
}) {
  return (
    <div className="relative z-10 text-center py-4">
      <div className="mx-auto flex h-20 w-20 items-center justify-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 ring-1 ring-green-500/30">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <div aria-hidden="true" className="absolute -inset-3 rounded-full bg-green-500/10 blur-xl" />
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold text-frsc-white-bright">{c.paySuccess}</h3>
      <p className="mt-2 text-sm text-frsc-text-200">{c.paySuccessDesc}</p>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-3 text-sm font-semibold text-white shadow-lg shadow-frsc-crimson-900/30 transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_28px_rgba(224,48,78,0.3)] active:scale-[0.97]"
      >
        {lang === 'id' ? 'Selesai' : 'Done'}
      </button>
    </div>
  )
}

/* ── Payment Error View ── */
function PaymentErrorView({
  error,
  lang,
  c,
  onRetry,
  onClose,
}: {
  error: string | null
  lang: string
  c: Record<string, string>
  onRetry: () => void
  onClose: () => void
}) {
  return (
    <div className="relative z-10 text-center py-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
        <AlertCircle className="h-8 w-8 text-red-400" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-frsc-white-bright">
        {lang === 'id' ? 'Pembayaran Gagal' : 'Payment Failed'}
      </h3>
      <p className="mt-2 text-sm text-frsc-text-200">{error || c.payError}</p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm font-medium text-frsc-text-200 transition-all duration-300 hover:border-white/[0.15] active:scale-[0.97]"
        >
          {c.payClose}
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] py-3 text-sm font-semibold text-white shadow-lg shadow-frsc-crimson-900/30 transition-all duration-300 hover:bg-[length:100%_100%] active:scale-[0.97]"
        >
          {c.payRetry}
        </button>
      </div>
    </div>
  )
}
