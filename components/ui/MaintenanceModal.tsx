'use client'

import { Wrench, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { easeEmphasized } from '@/lib/motion'
import { useLang } from '@/hooks/useLang'

const content = {
  id: {
    title: 'Sedang Maintenance',
    description: 'Halaman ini sedang dalam pemeliharaan untuk peningkatan kualitas layanan.',
    back: 'Kembali',
  },
  en: {
    title: 'Under Maintenance',
    description: 'This page is currently under maintenance to improve service quality.',
    back: 'Go Back',
  },
}

export function MaintenanceModal() {
  const { lang } = useLang()
  const c = content[lang] ?? content.id

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop — darkens & blurs the page content behind */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: easeEmphasized }}
        className="relative z-10 mx-4 w-full max-w-md rounded-3xl border border-white/[0.08] bg-[rgba(12,12,18,0.92)] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-frsc-crimson-800/30 to-frsc-purple-800/20 ring-1 ring-frsc-crimson-700/30 shadow-[0_0_24px_rgba(224,48,78,0.1)]">
          <Wrench className="h-7 w-7 text-frsc-crimson-400" />
        </div>

        {/* Title */}
        <h2 className="heading-fluid text-h3 text-frsc-white-bright">
          {c.title}
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-frsc-text-200">
          {c.description}
        </p>

        {/* Back button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-frsc-crimson-600 to-frsc-crimson-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-frsc-crimson-500/20 transition-all duration-200 hover:from-frsc-crimson-500 hover:to-frsc-crimson-600 hover:shadow-frsc-crimson-500/30 active:scale-[0.97]"
        >
          <ArrowLeft className="h-4 w-4" />
          {c.back}
        </button>
      </motion.div>
    </div>
  )
}
