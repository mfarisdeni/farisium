import { cn } from '@/lib/utils'

interface DividerProps {
  className?: string
  variant?: 'line' | 'crimson' | 'metallic'
  label?: string
}

export function Divider({
  className,
  variant = 'line',
  label,
}: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className={cn('h-px flex-1', variant === 'metallic' ? 'bg-gradient-to-r from-transparent via-white/15 to-transparent' : 'bg-border')} />
        <span className="text-xs font-medium text-frsc-text-200">{label}</span>
        <span className={cn('h-px flex-1', variant === 'metallic' ? 'bg-gradient-to-r from-transparent via-white/15 to-transparent' : 'bg-border')} />
      </div>
    )
  }

  return (
    <span
      className={cn(
        'block h-px w-full',
        variant === 'crimson' ? 'bg-frsc-crimson-700/30' : variant === 'metallic' ? 'bg-gradient-to-r from-transparent via-white/15 to-transparent' : 'bg-border',
        className,
      )}
    />
  )
}
