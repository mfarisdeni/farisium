const REWARD_COOLDOWN = 24 * 60 * 60 * 1000
const REWARD_DELAY = 15 * 1000

const KEYS = {
  lastReward: 'frsc_last_reward',
  pendingReward: 'frsc_reward_pending',
} as const

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function startRewardFlow(): void {
  if (!isBrowser()) return
  localStorage.setItem(KEYS.pendingReward, Date.now().toString())
}

export function canClaimReward(): boolean {
  if (!isBrowser()) return false

  const pending = localStorage.getItem(KEYS.pendingReward)
  if (!pending) return false

  return Date.now() - Number(pending) > REWARD_DELAY
}

export function getRemainingCooldown(): number {
  if (!isBrowser()) return 0

  const last = localStorage.getItem(KEYS.lastReward)
  if (!last) return 0

  const remaining = REWARD_COOLDOWN - (Date.now() - Number(last))
  return Math.max(0, remaining)
}

export function isRewardAvailable(): boolean {
  if (!isBrowser()) return false
  return getRemainingCooldown() === 0
}

export function completeReward(): void {
  if (!isBrowser()) return
  localStorage.setItem(KEYS.lastReward, Date.now().toString())
  localStorage.removeItem(KEYS.pendingReward)
}

export function clearRewardState(): void {
  if (!isBrowser()) return
  localStorage.removeItem(KEYS.lastReward)
  localStorage.removeItem(KEYS.pendingReward)
}

export function getRewardStatus() {
  if (!isBrowser()) {
    return { available: false, canClaim: false, cooldown: 0 }
  }

  return {
    available: isRewardAvailable(),
    canClaim: canClaimReward(),
    cooldown: getRemainingCooldown(),
  }
}
