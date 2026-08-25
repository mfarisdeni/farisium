'use client'

import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <span className="mb-4 font-heading text-7xl font-black tracking-tighter text-frsc-crimson-500/30">
        500
      </span>
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Terjadi Kesalahan
      </h1>
      <p className="mt-3 max-w-sm text-sm text-frsc-text-300">
        Terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke halaman utama.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-frsc-crimson-800 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-frsc-crimson-700 hover:shadow-[0_0_20px_rgba(224,48,78,0.35)]"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-frsc-surface-800 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-frsc-crimson-500/30 hover:bg-frsc-crimson-900/10"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/ai"
          className="rounded-xl border border-border bg-frsc-surface-800 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-frsc-crimson-500/30 hover:bg-frsc-crimson-900/10"
        >
          Jelajahi AI Tools
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <p className="mt-6 max-w-lg text-left text-xs text-frsc-text-400">
          {error.message}
        </p>
      )}
    </div>
  )
}
