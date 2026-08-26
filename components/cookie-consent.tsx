'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  advertising: boolean
}

const CONSENT_KEY = 'fc_consent'
const CONSENT_VERSION = '1'

function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.v !== CONSENT_VERSION) return null
    return parsed.p as ConsentPreferences
  } catch {
    return null
  }
}

function storeConsent(prefs: ConsentPreferences) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ v: CONSENT_VERSION, p: prefs }),
  )
}

export function getConsent(): ConsentPreferences {
  return getStoredConsent() ?? { necessary: true, analytics: false, advertising: false }
}

function applyConsent(prefs: ConsentPreferences) {
  if (typeof window === 'undefined') return
  const dl = window.dataLayer
  if (!dl) return

  dl.push({
    event: 'consent_update',
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    ad_storage: prefs.advertising ? 'granted' : 'denied',
    ad_user_data: prefs.advertising ? 'granted' : 'denied',
    ad_personalization: prefs.advertising ? 'granted' : 'denied',
  })
}

export function CookieConsent() {
  const { lang } = useLang()
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    advertising: false,
  })

  const isEn = lang === 'en'

  useEffect(() => {
    const stored = getStoredConsent()
    if (stored) {
      applyConsent(stored)
    } else {
      setVisible(true)
    }

    const onOpen = () => {
      const current = getStoredConsent()
      if (current) setPrefs(current)
      setVisible(true)
      setShowPrefs(true)
    }
    window.addEventListener('open-cookie-consent', onOpen)
    return () => window.removeEventListener('open-cookie-consent', onOpen)
  }, [])

  const acceptAll = useCallback(() => {
    const p: ConsentPreferences = { necessary: true, analytics: true, advertising: true }
    storeConsent(p)
    applyConsent(p)
    setVisible(false)
    setShowPrefs(false)
  }, [])

  const rejectNonEssential = useCallback(() => {
    const p: ConsentPreferences = { necessary: true, analytics: false, advertising: false }
    storeConsent(p)
    applyConsent(p)
    setVisible(false)
    setShowPrefs(false)
  }, [])

  const savePrefs = useCallback(() => {
    storeConsent(prefs)
    applyConsent(prefs)
    setVisible(false)
    setShowPrefs(false)
  }, [prefs])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] p-4 sm:p-6" role="dialog" aria-label="Cookie consent" aria-modal="false">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0d0d12]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        {!showPrefs ? (
          <>
            <p className="text-sm leading-relaxed text-frsc-text-200">
              {isEn
                ? 'We use cookies to keep your account secure, analyze usage, and — when enabled — serve relevant ads. You can accept all, reject non-essential ones, or manage your preferences.'
                : 'Kami menggunakan cookie untuk menjaga keamanan akun, menganalisis penggunaan, dan — ketika diaktifkan — menayangkan iklan yang relevan. Anda dapat menerima semua, menolak yang tidak esensial, atau mengelola preferensi Anda.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-xl bg-frsc-crimson-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-frsc-crimson-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
              >
                {isEn ? 'Accept All' : 'Terima Semua'}
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-frsc-text-200 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
              >
                {isEn ? 'Reject Non-Essential' : 'Tolak Non-Esensial'}
              </button>
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-frsc-text-200 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
              >
                <Settings className="h-3 w-3" />
                {isEn ? 'Manage' : 'Kelola'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-frsc-white-bright">{isEn ? 'Cookie Preferences' : 'Preferensi Cookie'}</h3>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 text-sm text-frsc-text-200">
                <input type="checkbox" checked disabled className="h-4 w-4 rounded border-white/20 bg-white/10 accent-frsc-crimson-600" />
                <span>
                  <span className="font-medium text-frsc-white-bright">{isEn ? 'Essential' : 'Esensial'}</span> — {isEn ? 'Required for security and authentication. Cannot be disabled.' : 'Diperlukan untuk keamanan dan autentikasi. Tidak dapat dinonaktifkan.'}
                </span>
              </label>
              <label className="flex items-center gap-3 text-sm text-frsc-text-200">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 accent-frsc-crimson-600"
                />
                <span>
                  <span className="font-medium text-frsc-white-bright">Analytics</span> — {isEn ? 'Helps us understand platform usage.' : 'Membantu kami memahami penggunaan platform.'}
                </span>
              </label>
              <label className="flex items-center gap-3 text-sm text-frsc-text-200">
                <input
                  type="checkbox"
                  checked={prefs.advertising}
                  onChange={(e) => setPrefs((p) => ({ ...p, advertising: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 accent-frsc-crimson-600"
                />
                <span>
                  <span className="font-medium text-frsc-white-bright">{isEn ? 'Advertising' : 'Periklanan'}</span> — {isEn ? 'Relevant ads based on page content.' : 'Iklan yang relevan berdasarkan konten halaman.'}
                </span>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={savePrefs}
                className="rounded-xl bg-frsc-crimson-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-frsc-crimson-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
              >
                {isEn ? 'Save Preferences' : 'Simpan Preferensi'}
              </button>
              <button
                type="button"
                onClick={() => setShowPrefs(false)}
                className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-frsc-text-200 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50"
              >
                {isEn ? 'Back' : 'Kembali'}
              </button>
            </div>
          </>
        )}
        <p className="mt-3 text-[11px] text-frsc-text-300">
          <Link href="/cookie-policy" className="underline underline-offset-2 hover:text-frsc-text-200">{isEn ? 'Cookie Policy' : 'Kebijakan Cookie'}</Link>
          {' · '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-frsc-text-200">{isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}</Link>
        </p>
      </div>
    </div>
  )
}
