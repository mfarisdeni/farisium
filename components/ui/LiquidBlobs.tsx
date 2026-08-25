'use client'

import { cn } from '@/lib/utils'

interface BlobConfig {
  size: string
  position: { top?: string; left?: string; right?: string; bottom?: string }
  shape: string
  gradient: string
  blur: string
  opacity: string
  animation: string
  delay: string
}

const blobs: BlobConfig[] = [
  {
    size: 'min-[520px] w-[480px] h-[480px] lg:w-[600px] lg:h-[600px]',
    position: { top: '-10%', left: '-5%' },
    shape: 'liquid-blob-default',
    gradient: 'radial-gradient(ellipse at 35% 40%, rgba(220,220,230,0.12), rgba(180,180,190,0.04) 60%, transparent)',
    blur: 'blur-[80px]',
    opacity: 'opacity-80',
    animation: 'animate-liquid-1',
    delay: '0s',
  },
  {
    size: 'min-[380px] w-[350px] h-[350px] lg:w-[450px] lg:h-[450px]',
    position: { right: '-8%', top: '5%' },
    shape: 'liquid-blob-rounded',
    gradient: 'radial-gradient(ellipse at 55% 45%, rgba(224,48,78,0.08), rgba(180,48,78,0.03) 60%, transparent)',
    blur: 'blur-[70px]',
    opacity: 'opacity-60',
    animation: 'animate-liquid-2',
    delay: '-7s',
  },
  {
    size: 'min-[220px] w-[200px] h-[200px] lg:w-[260px] lg:h-[260px]',
    position: { right: '15%', bottom: '10%' },
    shape: 'liquid-blob-elongated',
    gradient: 'radial-gradient(ellipse at 50% 50%, rgba(100,47,127,0.07), rgba(80,37,107,0.02) 60%, transparent)',
    blur: 'blur-[60px]',
    opacity: 'opacity-50',
    animation: 'animate-liquid-3',
    delay: '-14s',
  },
  {
    size: 'min-[280px] w-[250px] h-[250px] lg:w-[320px] lg:h-[320px]',
    position: { left: '20%', bottom: '5%' },
    shape: 'liquid-blob-accent',
    gradient: 'radial-gradient(ellipse at 45% 55%, rgba(220,220,235,0.06), rgba(200,200,215,0.02) 60%, transparent)',
    blur: 'blur-[55px]',
    opacity: 'opacity-40',
    animation: 'animate-liquid-4',
    delay: '-5s',
  },
]

interface LiquidBlobsProps {
  className?: string
  variant?: 'hero' | 'section' | 'full'
}

export function LiquidBlobs({ className, variant = 'hero' }: LiquidBlobsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'liquid-container',
        variant === 'full' && 'fixed inset-0 -z-10',
        className,
      )}
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={cn(
            'absolute',
            blob.size,
            blob.shape,
            blob.blur,
            blob.opacity,
            blob.animation,
          )}
          style={{
            top: blob.position.top,
            left: blob.position.left,
            right: blob.position.right,
            bottom: blob.position.bottom,
            background: blob.gradient,
            animationDelay: blob.delay,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
