/**
 * Generic jobs collection + daily usage rate limiting (Firestore, server-side).
 * Every read enforces ownership: a job is only visible to its owner uid.
 */

import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/firebase-admin'
import { ApiError } from '@/lib/api'

export const RECEIPT_FEATURE = 'receipt_to_excel'
export const INVOICE_FEATURE = 'invoice_from_image'
export const DAILY_CONVERSION_LIMIT = 5

export const KNOWN_FEATURES = [RECEIPT_FEATURE, INVOICE_FEATURE] as const

export type Feature = (typeof KNOWN_FEATURES)[number]

export function isKnownFeature(value: string | undefined | null): value is Feature {
  return typeof value === 'string' && (KNOWN_FEATURES as readonly string[]).includes(value)
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed'

export interface JobRecord {
  id: string
  userId: string
  feature: string
  status: JobStatus
  inputKey: string
  outputKey: string | null
  originalFileName: string
  contentType: string
  model: string
  result: unknown | null
  error: string | null
  createdAt?: unknown
  startedAt?: unknown
  completedAt?: unknown
}

export interface CreateJobInput {
  originalFileName: string
  contentType: string
  model: string
}

function db() {
  return getAdminDb()
}

/**
 * Create a queued job and return its id. The inputKey is registered in a
 * follow-up call because it is derived from the (server-generated) job id.
 */
export async function createJob(
  uid: string,
  input: CreateJobInput,
  feature: Feature = RECEIPT_FEATURE,
): Promise<string> {
  const jobRef = db().collection('jobs').doc()
  await jobRef.set({
    userId: uid,
    feature,
    status: 'queued',
    inputKey: '',
    outputKey: null,
    originalFileName: input.originalFileName,
    contentType: input.contentType,
    model: input.model,
    result: null,
    error: null,
    createdAt: FieldValue.serverTimestamp(),
  })
  return jobRef.id
}

export async function setJobInputKey(jobId: string, inputKey: string): Promise<void> {
  await db().collection('jobs').doc(jobId).update({ inputKey })
}

export async function getJobOrThrow(jobId: string): Promise<JobRecord> {
  const snap = await db().collection('jobs').doc(jobId).get()
  if (!snap.exists) {
    throw new ApiError('Data tidak ditemukan.', { status: 404, code: 'job_not_found' })
  }
  const data = snap.data() as Record<string, unknown>
  return { id: snap.id, ...data } as unknown as JobRecord
}

export async function requireOwnedJob(jobId: string, uid: string): Promise<JobRecord> {
  const job = await getJobOrThrow(jobId)
  if (job.userId !== uid) {
    throw new ApiError('Akses ditolak.', { status: 403, code: 'forbidden' })
  }
  return job
}

type StatusPatch = {
  status: JobStatus
  startedAt?: ReturnType<typeof FieldValue.serverTimestamp>
  completedAt?: ReturnType<typeof FieldValue.serverTimestamp>
  outputKey?: string | null
  result?: unknown
  error?: string | null
}

export async function updateJobStatus(jobId: string, status: JobStatus, extra: Omit<StatusPatch, 'status'> = {}): Promise<void> {
  await db().collection('jobs').doc(jobId).update({ status, ...extra })
}

/**
 * Enforce the per-user daily conversion limit.
 * Keyed on users/{uid}/usage/{feature} storing { date: 'YYYY-MM-DD', count }.
 * Runs inside a transaction so two concurrent requests can't both pass.
 */
export async function consumeDailyConversionSlot(
  uid: string,
  feature: Feature = RECEIPT_FEATURE,
): Promise<void> {
  const docRef = db().collection('users').doc(uid).collection('usage').doc(feature)
  const today = new Date().toISOString().slice(0, 10)

  await db().runTransaction(async (tx) => {
    const snap = await tx.get(docRef)
    const data = snap.data()

    if (!snap.exists || data?.date !== today) {
      tx.set(docRef, { date: today, count: 1 })
      return
    }

    const count = typeof data?.count === 'number' ? (data.count as number) : 0
    if (count >= DAILY_CONVERSION_LIMIT) {
      throw new ApiError(
        `Batas harian ${DAILY_CONVERSION_LIMIT} konversi telah tercapai. Silakan coba lagi besok.`,
        { status: 429, code: 'daily_limit_reached' },
      )
    }

    tx.update(docRef, { count: count + 1 })
  })
}