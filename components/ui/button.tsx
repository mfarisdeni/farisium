import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border/60 bg-background text-frsc-text-200 hover:border-frsc-crimson-500/30 hover:bg-white/[0.03] hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'text-frsc-text-200 hover:bg-white/[0.04] hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        crimson:
          'relative overflow-hidden bg-frsc-crimson-800 text-white hover:bg-frsc-crimson-700 active:bg-frsc-crimson-900 shadow-lg shadow-frsc-crimson-900/30 hover:shadow-[0_0_24px_rgba(224,48,78,0.25)] focus-visible:ring-frsc-crimson-500/50',
        'crimson-gradient':
          'relative overflow-hidden bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-600 to-frsc-crimson-500 text-white bg-[length:200%_100%] animate-[gradient-shift_3s_ease-in-out_infinite] hover:from-frsc-crimson-700 hover:via-frsc-crimson-500 hover:to-frsc-crimson-400 shadow-lg shadow-frsc-crimson-900/30 hover:shadow-[0_0_28px_rgba(224,48,78,0.3)] focus-visible:ring-frsc-crimson-500/50',
        'crimson-ghost':
          'text-frsc-crimson-400 hover:bg-frsc-crimson-800/20 hover:text-frsc-crimson-300 focus-visible:ring-frsc-crimson-500/50',
        premium:
          'border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] text-frsc-text-100 shadow-metallic hover:from-white/[0.10] hover:to-white/[0.04] hover:border-white/20 active:from-white/[0.04] active:to-white/[0.01]',
        'premium-metallic':
          'border-transparent metallic-chrome text-frsc-text-100 shadow-metallic hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.97]',
        platina:
          'border-white/15 bg-background text-frsc-platinum hover:bg-white/[0.04] hover:border-white/25 active:bg-white/[0.02]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-auto min-h-10 gap-2 px-4 py-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
