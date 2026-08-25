'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { useAuthContext } from '@/contexts/AuthContext'
import { Loader2, Coins, SearchX } from 'lucide-react'

interface PaymentLog {
  id: string
  uid: string
  email: string | null
  displayName: string | null
  amount: number
  price: number
  totalAmount: string
  status: string
  orderId: string
  createdAt: string | null
  paidAt: string | null
  expiredAt: string | null
}

export default function PaymentLogsPage() {
  const { user, loading: authLoading } = useAuthContext()
  const [payments, setPayments] = useState<PaymentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }

    fetch('/api/payments/log')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setPayments(data.payments ?? [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-frsc-crimson-500" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-8 text-center shadow-metallic">
            <Coins className="mx-auto mb-4 h-12 w-12 text-frsc-crimson-500/50" />
            <h1 className="font-heading text-xl font-bold text-frsc-white-bright">Payment Logs</h1>
            <p className="mt-2 text-sm text-frsc-text-200">Sign in to view payment history.</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-frsc-crimson-400">ADMIN</span>
            <h1 className="mt-1 text-2xl font-bold text-frsc-white-bright">Payment Logs</h1>
            <p className="mt-1 text-sm text-frsc-text-200">FRSC top-up history</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {payments.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-12 text-center shadow-metallic">
              <SearchX className="mb-3 h-10 w-10 text-frsc-text-300/50" />
              <p className="text-sm text-frsc-text-200">No payment records yet.</p>
            </div>
          )}

          {payments.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-white/[0.06] shadow-metallic">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">User</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Email</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">FRSC</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Price (IDR)</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Total</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Status</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Order ID</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Created</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-frsc-white-bright">{p.displayName ?? '—'}</td>
                      <td className="px-4 py-3 text-frsc-text-200">{p.email ?? '—'}</td>
                      <td className="px-4 py-3 font-medium text-frsc-white-bright">{p.amount}</td>
                      <td className="px-4 py-3 text-frsc-text-200">Rp{p.price?.toLocaleString('id-ID') ?? '—'}</td>
                      <td className="px-4 py-3 text-frsc-text-200">{p.totalAmount ? `Rp${Number(p.totalAmount).toLocaleString('id-ID')}` : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                          p.status === 'PAID' || p.status === 'SUCCESS'
                            ? 'bg-green-500/15 text-green-400'
                            : p.status === 'EXPIRED'
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-yellow-500/15 text-yellow-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="max-w-[120px] truncate px-4 py-3 text-frsc-text-300 font-mono text-[11px]" title={p.orderId}>
                        {p.orderId}
                      </td>
                      <td className="px-4 py-3 text-frsc-text-300 text-[11px] whitespace-nowrap">
                        {p.createdAt ? new Date(p.createdAt).toLocaleString('id-ID') : '—'}
                      </td>
                      <td className="px-4 py-3 text-frsc-text-300 text-[11px] whitespace-nowrap">
                        {p.paidAt ? new Date(p.paidAt).toLocaleString('id-ID') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-4 text-xs text-frsc-text-300/60">
            Showing up to 200 most recent transactions.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
