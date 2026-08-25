'use client'

import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'premium' | 'subtle'
  blur?: 'light' | 'medium' | 'strong'
  withReflection?: boolean
  withAccent?: 'crimson' | 'purple' | 'none'
  withShimmer?: boolean
  as?: 'div' | 'section' | 'article' | 'button'
}

const blurMap = {
  light: 'glass-base-light',
  medium: 'glass-base',
  strong: 'glass-base-strong',
} as const

const shadowMap = {
  light: 'glass-shadow',
  medium: 'glass-shadow',
  strong: 'glass-shadow-lg',
} as const

export function GlassCard({
  children,
  className,
  variant = 'default',
  blur = 'medium',
  withReflection = true,
  withAccent = 'crimson',
  withShimmer = false,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden rounded-2xl',
        blurMap[blur],
        shadowMap[blur],
        variant === 'premium' && 'rounded-3xl',
        variant === 'subtle' && 'rounded-xl border-opacity-50',
        className,
      )}
    >
      {/* Decorative layers container (clipped to border-radius) */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-inherit">
        {/* Layer: Top-left reflection (light source) */}
        {withReflection && (
          <div
            aria-hidden="true"
            className="absolute inset-0 glass-reflection"
          />
        )}

        {/* Layer: Ambient accent light */}
        {withAccent === 'crimson' && (
          <div
            aria-hidden="true"
            className="absolute inset-0 glass-ambient-crimson"
          />
        )}
        {withAccent === 'purple' && (
          <div
            aria-hidden="true"
            className="absolute inset-0 glass-ambient-purple"
          />
        )}

        {/* Layer: Shimmer sweep */}
        {withShimmer && (
          <div
            aria-hidden="true"
            className="absolute inset-0 glass-shimmer-overlay"
          />
        )}
      </div>

      {/* Layer: Content */}
      <div className="relative z-[2]">
        {children}
      </div>
    </Tag>
  )
}
