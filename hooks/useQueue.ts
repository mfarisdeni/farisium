'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { QueueJob, QueueStatus } from '@/lib/queue'
import { QueueEngine } from '@/lib/queue'

export interface UseQueueOptions {
  maxConcurrent?: number
}

export function useQueue(options: UseQueueOptions = {}) {
  const { maxConcurrent = 2 } = options
  const engineRef = useRef<QueueEngine | null>(null)

  const [activeJobs, setActiveJobs] = useState<QueueJob[]>([])
  const [activeCount, setActiveCount] = useState(0)
  const [queuedCount, setQueuedCount] = useState(0)

  if (!engineRef.current) {
    engineRef.current = new QueueEngine(maxConcurrent)
  }

  useEffect(() => {
    const engine = engineRef.current!
    const unsub = engine.subscribe((jobs) => {
      setActiveJobs(jobs)
      setActiveCount(jobs.filter((j) => j.status === 'active').length)
      setQueuedCount(jobs.filter((j) => j.status === 'queued').length)
    })
    return unsub
  }, [])

  const trackJob = useCallback((id: string, status: QueueStatus = 'queued') => {
    engineRef.current?.trackJob(id, status)
  }, [])

  const removeJob = useCallback((id: string) => {
    engineRef.current?.removeJob(id)
  }, [])

  const enqueue = useCallback((fn: () => Promise<void>) => {
    return engineRef.current!.enqueue(fn)
  }, [])

  const reset = useCallback(() => {
    engineRef.current?.reset()
  }, [])

  return {
    activeJobs,
    activeCount,
    queuedCount,
    enqueue,
    trackJob,
    removeJob,
    reset,
  }
}
