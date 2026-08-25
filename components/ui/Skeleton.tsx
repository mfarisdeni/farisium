import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  /** Use premium shimmer sweep instead of default pulse. Opt-in, additive. */
  shimmer?: boolean
}

export function Skeleton({
  className,
  variant = 'text',
  shimmer = false,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        shimmer ? 'skeleton-shimmer' : 'animate-pulse bg-frsc-surface-700',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 w-full rounded-md',
        variant === 'rectangular' && 'rounded-xl',
        className,
      )}
      aria-hidden="true"
    />
  )
}