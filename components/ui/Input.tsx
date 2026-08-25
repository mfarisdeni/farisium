'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'w-full rounded-lg border bg-frsc-surface-800/60 text-frsc-text-100 placeholder:text-frsc-text-300/50 transition-all outline-none focus-visible:outline-none focus-visible:border-frsc-crimson-500/40 focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/30 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive/60 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive/20 [&::-webkit-scrollbar]:w-1.5',
  {
    variants: {
      variant: {
        default: 'border-border hover:border-white/15',
        ghost:
          'border-transparent bg-transparent hover:bg-white/[0.03] focus-visible:bg-white/[0.03]',
      },
      inputSize: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-3.5 text-sm',
        lg: 'h-11 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'default', inputSize: 'md' },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputVariants({ variant, inputSize }), className)}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, variant, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        inputVariants({ variant }),
        'h-auto min-h-24 resize-y py-2.5 leading-relaxed',
        className,
      )}
      {...props}
    />
  ),
)
TextArea.displayName = 'TextArea'