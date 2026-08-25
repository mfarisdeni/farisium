import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
  variant?: 'surface' | 'glass' | 'crimson' | 'muted' | 'premium'
  hover?: boolean
}

const variantClasses: Record<string, string> = {
  surface: 'rounded-2xl border border-border bg-frsc-surface-800 shadow-metallic',
  glass:
    'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl glass-edge-highlight',
  crimson: 'rounded-2xl border border-frsc-crimson-700/30 bg-frsc-crimson-900/10 shadow-metallic',
  muted: 'rounded-2xl border border-white/10 bg-white/5',
  premium:
    'rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent shadow-metallic',
}

const hoverClasses = cn(
  'hover-lift hover:border-frsc-crimson-500/30',
)

export function Card({
  children,
  className,
  as: Tag = 'div',
  variant = 'surface',
  hover = false,
}: CardProps) {
  return (
    <Tag
      className={cn(
        variantClasses[variant],
        hover && hoverClasses,
        className,
      )}
    >
      {children}
    </Tag>
  )
}