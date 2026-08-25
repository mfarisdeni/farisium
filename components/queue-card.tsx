'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { QueueJob } from '@/types'
import { useLang } from '@/hooks/useLang'
import { Card } from '@/components/ui/Card'

interface QueueCardProps {
  job: QueueJob
}

export function QueueCard({ job }: QueueCardProps) {
  const { t, lang } = useLang()
  const [msgIdx, setMsgIdx] = useState(0)

  const messages = t('queueStatusMessages')
  const msgArray: string[] = Array.isArray(messages)
    ? (messages as unknown as string[])
    : [
        lang === 'id' ? 'Menyiapkan imajinasi...' : 'Preparing imagination...',
        lang === 'id' ? 'Menelusuri dunia anime...' : 'Exploring anime worlds...',
        lang === 'id' ? 'Menciptakan karakter...' : 'Creating character...',
        lang === 'id' ? 'Menyelesaikan masterpiece...' : 'Finishing masterpiece...',
      ]

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % msgArray.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [msgArray.length])

  const isQueued = job.status === 'queued'
  const estWait = isQueued ? job.position * 25 : null

  const queueLabel =
    lang === 'id'
      ? `Antrian #${job.position}`
      : `Queue #${job.position}`

  return (
    <Card variant="surface" className="w-full p-6 lighting-edge-top">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Spinner */}
        <div className="relative flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-frsc-crimson-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-frsc-crimson-500 animate-spin" />
          <Loader2
            className="size-6 text-frsc-crimson-400 animate-spin"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isQueued ? queueLabel : t('queueTitle')}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {msgArray[msgIdx]}
          </p>
        </div>

        {/* Stats */}
        {isQueued && (
          <div className="flex items-center gap-4 text-xs">
            <div className="rounded-xl border border-border bg-frsc-surface-700/50 px-3 py-2.5">
              <p className="text-muted-foreground">{t('queuePosition')}</p>
              <p className="mt-0.5 text-lg font-semibold text-frsc-crimson-400">
                #{job.position}
              </p>
            </div>
            {estWait && (
              <div className="rounded-xl border border-border bg-frsc-surface-700/50 px-3 py-2.5">
                <p className="text-muted-foreground">{t('queueEstWait')}</p>
                <p className="mt-0.5 text-lg font-semibold">
                  ~{estWait}
                  <span className="text-xs text-muted-foreground ml-0.5">
                    {t('queueSeconds')}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
