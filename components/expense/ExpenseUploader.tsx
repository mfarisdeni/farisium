'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Camera, FileImage, Loader2, UploadCloud, X } from 'lucide-react'
import { MAX_REPORT_ITEMS } from '@/features/expense/schema'
import type { ExpenseContent } from './content'

export const ACCEPTED_RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_RECEIPT_SIZE = 10 * 1024 * 1024

export type QueueStatus = 'ready' | 'uploading' | 'processing' | 'completed' | 'failed'

export interface QueuedReceipt {
  /** Stable client id — also the expense row id once extraction succeeds. */
  id: string
  file: File
  preview: string
  status: QueueStatus
  jobId: string | null
  error: string | null
}

interface ExpenseUploaderProps {
  t: ExpenseContent
  queue: QueuedReceipt[]
  onAdd: (files: FileList | File[]) => void
  onRemove: (id: string) => void
  disabled: boolean
}

function newId(): string {
  return `r_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

export function makeQueuedReceipt(file: File, preview: string): QueuedReceipt {
  return { id: newId(), file, preview, status: 'ready', jobId: null, error: null }
}

export function ExpenseUploader({ t, queue, onAdd, onRemove, disabled }: ExpenseUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Object URLs are owned by the parent queue, so nothing to revoke here.
  useEffect(() => {
    if (queue.length === 0) setError(null)
  }, [queue.length])

  const full = queue.length >= MAX_REPORT_ITEMS

  const handleFiles = useCallback(
    (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return
      const incoming = Array.from(files)

      for (const file of incoming) {
        if (!ACCEPTED_RECEIPT_TYPES.includes(file.type)) {
          setError(t.typeError)
          continue
        }
        if (file.size > MAX_RECEIPT_SIZE) {
          setError(t.sizeError)
          continue
        }
        if (file.size <= 0) {
          setError(t.genericError)
          continue
        }
      }

      const valid = incoming.filter(
        (file) => ACCEPTED_RECEIPT_TYPES.includes(file.type) && file.size > 0 && file.size <= MAX_RECEIPT_SIZE,
      )
      if (valid.length > 0) onAdd(valid)
    },
    [onAdd, t],
  )

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled && !full) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (disabled || full) return
          handleFiles(event.dataTransfer.files)
        }}
        className={`rounded-2xl border border-dashed p-6 text-center transition-colors sm:p-10 ${
          dragging ? 'border-crimson/60 bg-crimson/5' : 'border-white/10 bg-white/[0.02]'
        }`}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-white/40" />
        <p className="mt-3 text-sm text-white/70">
          {t.drop}{' '}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || full}
            className="font-medium text-crimson underline underline-offset-4 disabled:opacity-40"
          >
            {t.browse}
          </button>
        </p>
        <p className="mt-1 text-xs text-white/40">{t.uploadHint}</p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_RECEIPT_TYPES.join(',')}
          multiple
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />

        <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => cameraInputRef.current?.click()}
            disabled={disabled || full}
          >
            <Camera className="h-4 w-4" />
            {t.camera}
          </Button>
          <span className="text-xs text-white/35">{t.cameraHint}</span>
        </div>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>

      {error ? <p className="text-sm text-amber-400">{error}</p> : null}
      {full ? <p className="text-sm text-white/50">{t.limitReached}</p> : null}

      {queue.length === 0 ? (
        <p className="text-center text-sm text-white/40">{t.emptyQueue}</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {queue.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.preview}
                alt={entry.file.name}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white/80">{entry.file.name}</p>
                <p className="text-xs text-white/40">
                  {entry.status === 'uploading' ? (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {t.statusUploading}
                    </span>
                  ) : entry.status === 'processing' ? (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {t.statusProcessing}
                    </span>
                  ) : entry.status === 'completed' ? (
                    t.statusCompleted
                  ) : entry.status === 'failed' ? (
                    <span className="text-amber-400">
                      {t.statusFailed}
                      {entry.error ? ` — ${entry.error}` : ''}
                    </span>
                  ) : (
                    t.fileReady
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                disabled={disabled}
                aria-label={t.remove}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 disabled:opacity-30"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {queue.length > 0 && !disabled ? (
        <GlassCard className="flex flex-col gap-1 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-xs text-white/50">
            <FileImage className="h-3.5 w-3.5" />
            {queue.length} / {MAX_REPORT_ITEMS}
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
            {t.addMore}
          </Button>
        </GlassCard>
      ) : null}
    </div>
  )
}
