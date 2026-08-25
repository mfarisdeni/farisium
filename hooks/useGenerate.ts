'use client'

import { useCallback, useRef, useState } from 'react'
import type { QueueJob } from '@/types'

export interface GenerateResult {
  success: boolean
  id?: string
  base64?: string
  prompt?: string
  error?: string
}

// Global queue — max 2 concurrent active generation jobs
const MAX_CONCURRENT = 2
let activeJobs = 0
const waitingCallbacks: Array<() => void> = []

function enqueue(fn: () => void) {
  if (activeJobs < MAX_CONCURRENT) {
    activeJobs++
    fn()
  } else {
    waitingCallbacks.push(fn)
  }
}

function dequeue() {
  activeJobs = Math.max(0, activeJobs - 1)
  const next = waitingCallbacks.shift()
  if (next) {
    activeJobs++
    next()
  }
}

type QueueSubscriber = (jobs: QueueJob[]) => void
const queueSubscribers: Set<QueueSubscriber> = new Set()
const allJobs: Map<string, QueueJob> = new Map()

function notifySubscribers() {
  const jobs = Array.from(allJobs.values()).filter(
    (j) => j.status === 'queued' || j.status === 'active',
  )
  let queuedPos = 1
  jobs.forEach((j) => {
    if (j.status === 'queued') {
      allJobs.set(j.id, { ...j, position: queuedPos++ })
    }
  })
  const updated = Array.from(allJobs.values()).filter(
    (j) => j.status === 'queued' || j.status === 'active',
  )
  queueSubscribers.forEach((sub) => sub(updated))
}

// ── Client-side SD API direct call (fallback when server can't reach ngrok) ──
const SD_API_URL = 'https://tidal-imprint-skipper.ngrok-free.dev'

const NEGATIVE_PROMPT = `
worst quality, low quality, normal quality, blurry,
bad anatomy, bad hands, extra fingers, missing fingers,
extra limbs, deformed, mutated, duplicate,
watermark, signature, logo, username, text,
cropped, jpeg artifacts
`

async function callSdDirectly(
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  const payload: Record<string, unknown> = {
    prompt,
    negative_prompt: NEGATIVE_PROMPT,
    width: 480,
    height: 640,
    steps: 20,
    cfg_scale: 7,
    sampler_name: 'DPM++ 2M Karras',
    n_iter: 1,
    batch_size: 1,
  }

  const res = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Direct API call failed (${res.status}): ${text.slice(0, 120)}`)
  }

  const data = (await res.json()) as { images?: string[] }
  const image = data.images?.[0]
  if (!image) throw new Error('No image returned from direct API call.')

  return image.startsWith('data:') ? image : `data:image/png;base64,${image}`
}

export interface UseGenerateResult {
  generate: (prompt: string) => Promise<GenerateResult>
  isLoading: boolean
  progress: number
  error: string | null
  queueJob: QueueJob | null
  activeCount: number
}

export function useGenerate(): UseGenerateResult {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [queueJob, setQueueJob] = useState<QueueJob | null>(null)
  const [activeCount, setActiveCount] = useState(0)

  const generate = useCallback(async (prompt: string): Promise<GenerateResult> => {
    setIsLoading(true)
    setError(null)
    setProgress(0)
    const jobId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`

    const job: QueueJob = {
      id: jobId,
      prompt,
      position: waitingCallbacks.length + 1,
      createdAt: Date.now(),
      status: activeJobs >= MAX_CONCURRENT ? 'queued' : 'active',
    }

    allJobs.set(jobId, job)
    setQueueJob(job)
    notifySubscribers()
    setActiveCount(activeJobs)

    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 88 ? p + Math.random() * 10 : p))
    }, 400)

    return await new Promise<GenerateResult>((resolve) => {
      enqueue(async () => {
        const updatedJob: QueueJob = { ...job, status: 'active', position: 0 }
        allJobs.set(jobId, updatedJob)
        setQueueJob(updatedJob)
        notifySubscribers()
        setActiveCount(activeJobs)

        setProgress(8)

        try {
          // ── Try server-side call first ──
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
          })

          let base64: string | null = null
          let finalPrompt = prompt

          if (res.ok) {
            const data = (await res.json()) as {
              image?: string
              prompt?: string
              error?: string
            }
            if (data?.image) {
              base64 = data.image
              finalPrompt = data.prompt ?? prompt
            }
          }

          // ── Fallback: server gagal → coba langsung dari client ──
          if (!base64) {
            base64 = await callSdDirectly(prompt)
          }

          setProgress(100)
          resolve({
            success: true,
            id: jobId,
            base64,
            prompt: finalPrompt,
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Generation failed'
          setError(msg)
          resolve({
            success: false,
            error: msg,
          })
        } finally {
          clearInterval(progressTimer)
          const doneJob: QueueJob = {
            ...updatedJob,
            status: 'done',
          }
          allJobs.set(jobId, doneJob)
          setQueueJob(doneJob)
          setIsLoading(false)
          setTimeout(() => setProgress(0), 800)
          dequeue()
          notifySubscribers()
          setActiveCount(activeJobs)
        }
      })
    })
  }, [])

  return { generate, isLoading, progress, error, queueJob, activeCount }
}
