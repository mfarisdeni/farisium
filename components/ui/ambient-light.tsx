'use client'

import { useRef, useCallback, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface AmbientLightProps {
  children: React.ReactNode
  className?: string
  color?: 'crimson' | 'purple'
  intensity?: number
}

export function AmbientLight({
  children,
  className,
  color = 'crimson',
  intensity = 0.08,
}: AmbientLightProps) {
  const lightRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!lightRef.current) return
    const rect = lightRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    lightRef.current.style.setProperty('--cursor-x', `${x}%`)
    lightRef.current.style.setProperty('--cursor-y', `${y}%`)
  }, [])

  const accent =
    color === 'crimson'
      ? `rgba(224,48,78,${intensity})`
      : `rgba(100,47,127,${intensity})`

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn('group/ambient relative', className)}
    >
      <div
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/ambient:opacity-100"
        style={{
          background:
            'radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), ' +
            accent +
            ', transparent 70%)',
          zIndex: 0,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
