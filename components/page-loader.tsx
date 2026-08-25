'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(true)
  const resolved = useRef(false)

  useEffect(() => {
    if (resolved.current) return
    const already = sessionStorage.getItem('frsc_loaded')
    if (already) {
      resolved.current = true
      setHidden(true)
      return
    }

    // Show loader briefly, then reveal content
    setHidden(false)

    const done = () => {
      if (resolved.current) return
      resolved.current = true
      sessionStorage.setItem('frsc_loaded', 'true')
      setHidden(true)
    }

    // Reveal after 1.2s or when the window finishes loading, whichever comes first
    const timer = setTimeout(done, 1200)
    window.addEventListener('load', done, { once: true })

    // Safety — never block longer than 3s
    const safety = setTimeout(done, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(safety)
      window.removeEventListener('load', done)
    }
  }, [])

  if (hidden) return <>{children}</>

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        aria-hidden="true"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-frsc-crimson-700/20 blur-[80px]"
        />

        <Image
          src="/f-lazyload.png"
          alt="Farisium"
          width={72}
          height={72}
          priority
          className="h-18 w-18 animate-pulse"
        />

        <p className="mt-5 font-heading text-lg font-bold tracking-tight text-foreground">
          Farisium
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="block h-px w-6 bg-frsc-crimson-500/60" />
          <span className="text-[10px] font-medium tracking-[0.15em] text-frsc-text-300">
            PLATFORM AI
          </span>
          <span className="block h-px w-6 bg-frsc-crimson-500/60" />
        </div>
      </div>

      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    </>
  )
}
