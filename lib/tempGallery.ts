/**
 * Temporary in-memory gallery store.
 * Images live only for this browser session and expire after TTL_MS (10 minutes).
 * Everything is wiped on page refresh because it lives in module scope, not localStorage.
 */

const TTL_MS = 10 * 60 * 1000 // 10 minutes

interface TempEntry {
  url: string       // object URL created with URL.createObjectURL
  prompt: string
  createdAt: number
  expiresAt: number
  timerId: ReturnType<typeof setTimeout>
}

// Module-level map — survives re-renders, dies on page reload.
const store = new Map<string, TempEntry>()

// Listeners notified whenever store changes.
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach(fn => fn())
}

export function addTempImage(id: string, base64: string, prompt: string): string {
  // Convert base64 → Blob → object URL so it never touches localStorage/network.
  const byteString = atob(base64.replace(/^data:image\/\w+;base64,/, ''))
  const bytes = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i)
  const blob = new Blob([bytes], { type: 'image/png' })
  const url = URL.createObjectURL(blob)

  // Cancel any existing timer for this id (shouldn't happen, but be safe).
  const existing = store.get(id)
  if (existing) {
    clearTimeout(existing.timerId)
    URL.revokeObjectURL(existing.url)
  }

  const now = Date.now()
  const timerId = setTimeout(() => {
    const entry = store.get(id)
    if (entry) URL.revokeObjectURL(entry.url)
    store.delete(id)
    notify()
  }, TTL_MS)

  store.set(id, { url, prompt, createdAt: now, expiresAt: now + TTL_MS, timerId })
  notify()
  return url
}

export function getTempImages() {
  const now = Date.now()
  // Filter out any that somehow slipped through without being cleaned.
  const results: Array<{ id: string; url: string; prompt: string; createdAt: number }> = []
  store.forEach((entry, id) => {
    if (entry.expiresAt > now) {
      results.push({ id, url: entry.url, prompt: entry.prompt, createdAt: entry.createdAt })
    }
  })
  return results.sort((a, b) => b.createdAt - a.createdAt)
}

export function subscribeTempGallery(fn: () => void): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

/** Return remaining seconds for an image, or 0 if expired/not found. */
export function getSecondsLeft(id: string): number {
  const entry = store.get(id)
  if (!entry) return 0
  return Math.max(0, Math.round((entry.expiresAt - Date.now()) / 1000))
}

/** Manually remove an image from the gallery. */
export function removeTempImage(id: string): void {
  const entry = store.get(id)
  if (!entry) return
  clearTimeout(entry.timerId)
  URL.revokeObjectURL(entry.url)
  store.delete(id)
  notify()
}
