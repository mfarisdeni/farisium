import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Halaman Tidak Ditemukan | Farisium',
  robots: { index: false, follow: false },
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <span className="mb-4 font-heading text-7xl font-black tracking-tighter text-frsc-crimson-500/30">
        404
      </span>
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-3 max-w-sm text-sm text-frsc-text-300">
        Halaman yang kamu cari tidak ada atau telah dipindahkan. Pastikan URL yang dimasukkan benar.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-frsc-crimson-800 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-frsc-crimson-700 hover:shadow-[0_0_20px_rgba(224,48,78,0.35)]"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/ai"
          className="rounded-xl border border-border bg-frsc-surface-800 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-frsc-crimson-500/30 hover:bg-frsc-crimson-900/10"
        >
          Jelajahi AI Tools
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-border bg-frsc-surface-800 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-frsc-crimson-500/30 hover:bg-frsc-crimson-900/10"
        >
          Baca Blog
        </Link>
      </div>
    </div>
  )
}
