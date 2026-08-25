import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'default' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const sizes = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
  xl: { width: 127, height: 28 },
}

const logoSrc = {
  default: '/farisium-logo.png',
  white: '/farisium-logo-w.png',
}

export function Logo({
  variant = 'white',
  size = 'md',
  className,
  showText = true,
}: LogoProps) {
  const dims = sizes[size]

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Image
        src={logoSrc[variant]}
        alt="Farisium"
        width={dims.width}
        height={dims.height}
        className="shrink-0"
        priority
      />
      {showText && (
        <span className="font-heading text-sm font-bold tracking-tight sm:text-base">
          Farisium
        </span>
      )}
    </span>
  )
}
