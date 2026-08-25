import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  as?: 'section' | 'div'
  spacing?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'muted' | 'crimson'
}

const spacingClasses: Record<string, string> = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-20',
  lg: 'py-20 md:py-32',
}

const variantClasses: Record<string, string> = {
  default: '',
  muted: 'bg-muted/50',
  crimson: 'bg-frsc-crimson-900/10',
}

export function Section({
  children,
  className,
  as: Tag = 'section',
  spacing = 'md',
  variant = 'default',
}: SectionProps) {
  return (
    <Tag
      className={cn(
        'w-full',
        spacingClasses[spacing],
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Tag>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="eyebrow-label text-eyebrow text-frsc-crimson-400">
          {eyebrow}
        </span>
      )}
      <Tag className="heading-fluid text-h2 text-frsc-white-bright text-balance">
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            'text-pretty text-lead text-frsc-text-200',
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-xl',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}