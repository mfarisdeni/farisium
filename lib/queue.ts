export type QueueStatus = 'queued' | 'active' | 'done' | 'error'

export interface QueueJob {
  id: string
  status: QueueStatus
  position: number
  createdAt: number
}

export type QueueSubscriber = (jobs: QueueJob[]) => void

export class QueueEngine {
  private maxConcurrent: number
  private activeCount = 0
  private waiting: Array<() => void> = []
  private jobs: Map<string, QueueJob> = new Map()
  private subscribers: Set<QueueSubscriber> = new Set()

  constructor(maxConcurrent = 2) {
    this.maxConcurrent = maxConcurrent
  }

  get activeJobs(): number {
    return this.activeCount
  }

  get queuedJobs(): number {
    return this.waiting.length
  }

  get allJobs(): QueueJob[] {
    return Array.from(this.jobs.values())
  }

  get activeJobList(): QueueJob[] {
    return this.allJobs.filter(
      (j) => j.status === 'queued' || j.status === 'active',
    )
  }

  subscribe(subscriber: QueueSubscriber): () => void {
    this.subscribers.add(subscriber)
    return () => {
      this.subscribers.delete(subscriber)
    }
  }

  private notify(): void {
    const jobs = this.activeJobList
    let queuedPos = 1
    jobs.forEach((j) => {
      if (j.status === 'queued') {
        this.jobs.set(j.id, { ...j, position: queuedPos++ })
      }
    })
    const updated = this.activeJobList
    this.subscribers.forEach((sub) => sub(updated))
  }

  private updateJob(id: string, partial: Partial<QueueJob>): void {
    const existing = this.jobs.get(id)
    if (existing) {
      this.jobs.set(id, { ...existing, ...partial })
    }
  }

  enqueue(fn: () => Promise<void>): Promise<void> {
    return new Promise((resolve) => {
      const run = async () => {
        try {
          await fn()
        } finally {
          this.dequeue()
          resolve()
        }
      }

      if (this.activeCount < this.maxConcurrent) {
        this.activeCount++
        run()
      } else {
        this.waiting.push(run)
      }
    })
  }

  private dequeue(): void {
    this.activeCount = Math.max(0, this.activeCount - 1)
    const next = this.waiting.shift()
    if (next) {
      this.activeCount++
      next()
    }
  }

  trackJob(id: string, status: QueueStatus = 'queued'): void {
    const existing = this.jobs.get(id)
    if (existing) {
      this.updateJob(id, { status })
    } else {
      this.jobs.set(id, {
        id,
        status,
        position: this.waiting.length + 1,
        createdAt: Date.now(),
      })
    }
    this.notify()
  }

  removeJob(id: string): void {
    this.jobs.delete(id)
    this.notify()
  }

  reset(): void {
    this.activeCount = 0
    this.waiting = []
    this.jobs.clear()
    this.notify()
  }
}
