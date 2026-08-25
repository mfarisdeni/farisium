import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface IconBoxProps {
  icon: ReactNode
  title: string
  description?: string
  className?: string
  direction?: 'row' | 'col'
}

export function IconBox({
  icon,
  title,
  description,
  className,
  direction = 'row',
}: IconBoxProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        direction === 'col' && 'flex-col items-center text-center',
        direction === 'row' && 'items-start',
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-frsc-crimson-800/20 text-frsc-crimson-400">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-frsc-text-100">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-frsc-text-300">{description}</p>
        )}
      </div>
    </div>
  )
}
