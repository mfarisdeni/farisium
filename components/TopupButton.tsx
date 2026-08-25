'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SupportModal } from '@/components/support-modal'

interface TopupButtonProps {
  variant?: 'hero' | 'inline'
  className?: string
}

export function TopupButton({ variant = 'inline', className = '' }: TopupButtonProps) {
  const [open, setOpen] = useState(false)

  if (variant === 'hero') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group/btn inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent px-6 py-3.5 text-sm font-semibold text-frsc-text-100 shadow-metallic transition-all duration-300 hover:border-frsc-crimson-500/30 hover:from-frsc-crimson-900/10 hover:to-transparent hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.97]"
        >
          <Image src="/farisium-coin.png" alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
          +FRSC
        </button>
        <SupportModal open={open} onClose={() => setOpen(false)} />
      </>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_24px_rgba(224,48,78,0.35)] active:scale-[0.97] ${className}`}
      >
        <Image src="/farisium-coin.png" alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
        +FRSC
      </button>
      <SupportModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
