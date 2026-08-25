'use client'

import { useEffect, useState, useRef } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { useAuthContext } from '@/contexts/AuthContext'
import { Loader2, Coins, SearchX, AlertTriangle, ShieldAlert, Plus } from 'lucide-react'

interface Transaction {
  id: string
  uid: string
  email: string | null
  displayName: string | null
  type: 'purchase' | 'spend' | 'reward' | 'admin'
  amount: number
  direction: 'in' | 'out'
  description: string
  referenceId: string | null
  createdAt: string
}

interface UserBalance {
  uid: string
  email: string | null
  displayName: string | null
  currentBalance: number
  loggedNet: number
  discrepancy: number
  suspicious: boolean
}

const typeColors: Record<string, string> = {
  purchase: 'bg-green-500/15 text-green-400',
  spend: 'bg-red-500/15 text-red-400',
  reward: 'bg-blue-500/15 text-blue-400',
  admin: 'bg-yellow-500/15 text-yellow-400',
}

export default function FRSCAuditPage() {
  const { user, loading: authLoading } = useAuthContext()
  const [txns, setTxns] = useState<Transaction[]>([])
  const [users, setUsers] = useState<UserBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllUsers, setShowAllUsers] = useState(false)

  // Manual log form
  const [showForm, setShowForm] = useState(false)
  const [formUid, setFormUid] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formDisplayName, setFormDisplayName] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formDirection, setFormDirection] = useState<'in' | 'out'>('in')
  const [formDesc, setFormDesc] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const uidRef = useRef<HTMLInputElement>(null)

  async function fetchData() {
    try {
      const r = await fetch('/api/admin/frsc-transactions')
      const data = await r.json()
      if (data.error) throw new Error(data.error)
      setTxns(data.transactions ?? [])
      setUsers(data.users ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    fetchData()
  }, [user, authLoading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formUid.trim() || !formAmount) return

    setFormSubmitting(true)
    try {
      const r = await fetch('/api/admin/frsc-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: formUid.trim(),
          email: formEmail.trim() || null,
          displayName: formDisplayName.trim() || null,
          type: 'admin',
          amount: Math.abs(Number(formAmount)),
          direction: formDirection,
          description: formDesc.trim() || 'Manual admin adjustment',
          referenceId: null,
        }),
      })
      const data = await r.json()
      if (data.error) throw new Error(data.error)

      // Reset form and refresh
      setFormUid(''); setFormEmail(''); setFormDisplayName('')
      setFormAmount(''); setFormDirection('in'); setFormDesc('')
      setShowForm(false)
      setLoading(true)
      await fetchData()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setFormSubmitting(false)
    }
  }

  function openForm(uid: string, email?: string | null, displayName?: string | null) {
    setFormUid(uid)
    setFormEmail(email ?? '')
    setFormDisplayName(displayName ?? '')
    setShowForm(true)
    setTimeout(() => uidRef.current?.focus(), 100)
  }

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
            <h1 className="font-heading text-xl font-bold text-frsc-white-bright">Access Denied</h1>
            <p className="mt-2 text-sm text-frsc-text-200">Sign in to access FRSC audit trail.</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const suspiciousUsers = users.filter((u) => u.suspicious)
  const cleanUsers = users.filter((u) => !u.suspicious)
  const displayUsers = showAllUsers ? users : suspiciousUsers

  const totalIn = txns.filter((t) => t.direction === 'in').reduce((s, t) => s + t.amount, 0)
  const totalOut = txns.filter((t) => t.direction === 'out').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-frsc-crimson-400">ADMIN</span>
              <h1 className="mt-1 text-2xl font-bold text-frsc-white-bright">FRSC Audit Trail</h1>
              <p className="mt-1 text-sm text-frsc-text-200">Balance comparison + transaction log — detects unauthorized FRSC changes</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span className="text-green-400">+{totalIn} FRSC in</span>
                <span className="text-red-400">-{totalOut} FRSC out</span>
                <span className="text-frsc-text-200">Logged net: {totalIn - totalOut} FRSC</span>
                {suspiciousUsers.length > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    {suspiciousUsers.length} user(s) with balance mismatch
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); if (!showForm) { setFormUid(''); setFormEmail(''); setFormDisplayName(''); setFormAmount(''); setFormDirection('in'); setFormDesc('') } }}
              className="inline-flex items-center gap-2 rounded-xl bg-frsc-crimson-800/40 px-4 py-2 text-sm font-semibold text-frsc-crimson-300 transition-colors hover:bg-frsc-crimson-800/60"
            >
              <Plus className="h-4 w-4" />
              Log Manual
            </button>
          </div>

          {/* Manual Log Form */}
          {showForm && (
            <div className="mb-8 rounded-2xl border border-white/[0.08] bg-frsc-black/60 p-5 shadow-metallic">
              <h3 className="mb-4 text-sm font-bold text-frsc-white-bright">Log Manual FRSC Change</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-frsc-text-300">UID *</label>
                  <input ref={uidRef} value={formUid} onChange={(e) => setFormUid(e.target.value)} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-frsc-white-bright placeholder-frsc-text-300/50 outline-none focus:border-frsc-crimson-700" placeholder="Firebase UID" required />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-frsc-text-300">Email</label>
                  <input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-frsc-white-bright placeholder-frsc-text-300/50 outline-none focus:border-frsc-crimson-700" placeholder="user@email.com" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-frsc-text-300">Display Name</label>
                  <input value={formDisplayName} onChange={(e) => setFormDisplayName(e.target.value)} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-frsc-white-bright placeholder-frsc-text-300/50 outline-none focus:border-frsc-crimson-700" placeholder="User name" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-frsc-text-300">Amount *</label>
                  <input type="number" min="1" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-frsc-white-bright placeholder-frsc-text-300/50 outline-none focus:border-frsc-crimson-700" placeholder="10" required />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-frsc-text-300">Direction</label>
                  <select value={formDirection} onChange={(e) => setFormDirection(e.target.value as 'in' | 'out')} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-frsc-white-bright outline-none focus:border-frsc-crimson-700">
                    <option value="in">+ In (add FRSC)</option>
                    <option value="out">- Out (deduct FRSC)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-frsc-text-300">Description</label>
                  <input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-frsc-white-bright placeholder-frsc-text-300/50 outline-none focus:border-frsc-crimson-700" placeholder="e.g. Manual inject confirmation" />
                </div>
                <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
                  <button type="submit" disabled={formSubmitting} className="rounded-xl bg-frsc-crimson-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-frsc-crimson-700 disabled:opacity-50">
                    {formSubmitting ? 'Logging...' : 'Log Transaction'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/[0.08] px-5 py-2 text-sm text-frsc-text-200 transition-colors hover:bg-white/[0.03]">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* User Balance Overview */}
          {users.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-frsc-white-bright">
                  {suspiciousUsers.length > 0
                    ? `Suspicious — ${suspiciousUsers.length} user(s) with balance mismatch`
                    : 'All user balances match the transaction log'}
                </h2>
                {suspiciousUsers.length > 0 && (
                  <button
                    onClick={() => setShowAllUsers(!showAllUsers)}
                    className="text-xs text-frsc-crimson-400 hover:text-frsc-crimson-300 transition-colors"
                  >
                    {showAllUsers ? 'Show suspicious only' : `Show all (${cleanUsers.length} clean)`}
                  </button>
                )}
              </div>

              <div className="mb-8 overflow-x-auto rounded-2xl border border-white/[0.06] shadow-metallic">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      <th className="px-4 py-3 font-semibold text-frsc-text-200">User</th>
                      <th className="px-4 py-3 font-semibold text-frsc-text-200">Email</th>
                      <th className="px-4 py-3 font-semibold text-frsc-text-200">Current Balance</th>
                      <th className="px-4 py-3 font-semibold text-frsc-text-200">Logged Net</th>
                      <th className="px-4 py-3 font-semibold text-frsc-text-200">Discrepancy</th>
                      <th className="px-4 py-3 font-semibold text-frsc-text-200">Status</th>
                      <th className="px-4 py-3 font-semibold text-frsc-text-200">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.map((u) => (
                      <tr
                        key={u.uid}
                        className={`border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02] ${u.suspicious ? 'bg-yellow-500/5' : ''}`}
                      >
                        <td className="px-4 py-3 text-frsc-white-bright">{u.displayName ?? '—'}</td>
                        <td className="px-4 py-3 text-frsc-text-200">{u.email ?? u.uid.slice(0, 12)}</td>
                        <td className="px-4 py-3 font-medium tabular-nums text-frsc-white-bright">
                          {u.currentBalance}
                        </td>
                        <td className="px-4 py-3 font-medium tabular-nums text-frsc-text-200">
                          {u.loggedNet}
                        </td>
                        <td className={`px-4 py-3 font-medium tabular-nums ${u.discrepancy !== 0 ? 'text-yellow-400' : 'text-frsc-text-300'}`}>
                          {u.discrepancy > 0 ? `+${u.discrepancy}` : u.discrepancy === 0 ? '0' : u.discrepancy}
                        </td>
                        <td className="px-4 py-3">
                          {u.suspicious ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-yellow-400">
                              <ShieldAlert className="h-3 w-3" />
                              Mismatch
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-green-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-green-400">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openForm(u.uid, u.email, u.displayName)}
                            className="text-xs text-frsc-crimson-400 hover:text-frsc-crimson-300 transition-colors"
                          >
                            Log
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Transaction Table */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-frsc-white-bright">Transaction Log</h2>
            <span className="text-xs text-frsc-text-300/60">({txns.length} entries)</span>
          </div>

          {txns.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-frsc-surface-800 p-12 text-center shadow-metallic">
              <SearchX className="mb-3 h-10 w-10 text-frsc-text-300/50" />
              <p className="text-sm text-frsc-text-200">No FRSC transactions recorded yet.</p>
            </div>
          )}

          {txns.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-white/[0.06] shadow-metallic">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Time</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">User</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Email</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Type</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">FRSC</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Description</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">Reference</th>
                    <th className="px-4 py-3 font-semibold text-frsc-text-200">UID</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t.id} className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-4 py-3 text-[11px] text-frsc-text-300">
                        {new Date(t.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-frsc-white-bright">{t.displayName ?? '—'}</td>
                      <td className="px-4 py-3 text-frsc-text-200">{t.email ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${typeColors[t.type] ?? ''}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-medium tabular-nums ${t.direction === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.direction === 'in' ? '+' : '-'}{t.amount}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-frsc-text-200" title={t.description}>
                        {t.description || '—'}
                      </td>
                      <td className="max-w-[120px] truncate px-4 py-3 font-mono text-[11px] text-frsc-text-300" title={t.referenceId ?? ''}>
                        {t.referenceId ?? '—'}
                      </td>
                      <td className="max-w-[100px] truncate px-4 py-3 font-mono text-[11px] text-frsc-text-300" title={t.uid}>
                        {t.uid.slice(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-4 text-xs text-frsc-text-300/60">
            Discrepancy = current balance &minus; logged net. Non-zero = unauthorized FRSC change detected. Use the &quot;Log&quot; button or &quot;Log Manual&quot; form to record manual adjustments.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
