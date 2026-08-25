import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'crimson' | 'outline' | 'platinum' | 'premium'
  size?: 'sm' | 'md'
}

const variantClasses: Record<string, string> = {
  default: 'bg-frsc-surface-700 text-frsc-text-200 border border-border',
  crimson:
    'bg-frsc-crimson-800/40 text-frsc-crimson-300 border border-frsc-crimson-700/30',
  outline: 'bg-transparent text-frsc-text-200 border border-border',
  platinum: 'border border-white/15 bg-white/[0.04] text-frsc-platinum',
  premium:
    'border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-transparent text-frsc-platinum shadow-metallic',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'sm',
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium tracking-wide',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  )
}