'use client'

import * as React from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { easeEmphasized } from '@/lib/motion'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
  /** Hide the default close button (top-right). */
  hideClose?: boolean
  /** Size preset for the modal width. */
  size?: 'sm' | 'md' | 'lg'
  onClose?: () => void
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({
  open,
  onOpenChange,
  children,
  className,
  hideClose = false,
  size = 'md',
  onClose,
}: ModalProps) {
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      onOpenChange(next)
      if (!next && onClose) onClose()
    },
    [onOpenChange, onClose],
  )

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 z-modal bg-black/70 backdrop-blur-sm"
        />

        <Dialog.Popup
          className={cn(
            'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2',
            'w-full outline-none',
            sizeClasses[size],
            'glass-base-strong glass-shadow-lg glass-edge-highlight',
            'rounded-3xl p-6 sm:p-8',
            className,
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, ease: easeEmphasized }}
          >
            {children}
          </motion.div>

          {!hideClose && (
            <Dialog.Close
              render={
                <button
                  type="button"
                  aria-label="Close"
                  className={cn(
                    'absolute right-3 top-3 z-10 rounded-lg p-1.5',
                    'text-frsc-text-300/60 transition-colors hover:text-frsc-text-100',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/40',
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              }
            />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Title className="heading-fluid text-h3 text-frsc-white-bright text-balance">
      {children}
    </Dialog.Title>
  )
}

export function ModalDescription({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Description className="mt-2 text-sm leading-relaxed text-frsc-text-200">
      {children}
    </Dialog.Description>
  )
}