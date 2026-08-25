'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import {
  Check,
  Coins,
  Download,
  ImageIcon,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GeneratedImage, QueueJob } from '@/types'
import { QueueCard } from '@/components/queue-card'
import { useLang } from '@/hooks/useLang'
import { enhancePrompt } from '@/lib/enhancePrompt'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

import {
  canClaimReward,
  completeReward,
  getRemainingCooldown,
} from '@/lib/rewards'

interface GeneratorProps {
  onGenerate: (prompt: string) => Promise<boolean | void>
  onBuyCoins: () => void
  onRewardClaim: () => Promise<void>
  isLoggedIn: boolean
  isLoading: boolean
  progress: number
  error: string | null
  result: GeneratedImage | null
  coins: number
  queueJob: QueueJob | null
}

export function Generator({
  onGenerate,
  onBuyCoins,
  isLoading,
  onRewardClaim,
  progress,
  error,
  result,
  coins,
  queueJob,
  isLoggedIn,
}: GeneratorProps)
{
  const { t } = useLang()
  const [prompt, setPrompt] = useState('')
  const [enhanced, setEnhanced] = useState(false)

  const [rewardReady, setRewardReady] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const router = useRouter()

  const cooldownHours = Math.floor(
    cooldown / 3600000
  )

  const cooldownMinutes = Math.floor(
    (cooldown % 3600000) / 60000
  )

  const cooldownSeconds = Math.floor(
    (cooldown % 60000) / 1000
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim() || isLoading || coins <= 0) return

    await onGenerate(prompt.trim())
  }

  const handleEnhance = useCallback(() => {
    if (!prompt.trim()) return
    const enhanced = enhancePrompt(prompt.trim())
    setPrompt(enhanced)
    setEnhanced(true)
    setTimeout(() => setEnhanced(false), 2500)
  }, [prompt])

  const downloadImage = () => {
    if (!result) return

    const a = document.createElement('a')
    a.href = result.url
    a.download = `farisium-anime-${result.id.slice(0, 8)}.png`

    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleEarnFreeCoin = () => {
    if (cooldown > 0) return

    router.push('/rewards')
  }

  const handleClaimReward = async () => {
    await onRewardClaim()

    completeReward()

    setRewardReady(false)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setRewardReady(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    const update = () => {
      setRewardReady(canClaimReward())
      setCooldown(getRemainingCooldown())
    }

    update()

    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [])

  const showQueue =
    isLoading && queueJob && (queueJob.status === 'queued' || queueJob.status === 'active')

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      {/* ── Controls ── */}
      <Card variant="surface" className="p-5 lighting-edge-top">
        {/* Label + enhance button */}
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="prompt" className="text-sm font-semibold">
            {t('promptLabel') as string}
          </label>
          <button
            type="button"
            onClick={handleEnhance}
            disabled={!prompt.trim() || isLoading}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
              enhanced
                ? 'border-frsc-crimson-500/60 bg-frsc-crimson-800/20 text-frsc-crimson-300'
                : 'border-border bg-secondary/40 text-muted-foreground hover:border-frsc-crimson-500/40 hover:text-foreground hover:bg-frsc-crimson-800/10 disabled:opacity-40'
            }`}
            aria-label={t('enhanceBtn') as string}
          >
            {enhanced ? (
              <>
                <Check className="size-3" aria-hidden="true" />
                <span>{t('enhancedBtn') as string}</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3" aria-hidden="true" />
                <span>{t('enhanceBtn') as string}</span>
              </>
            )}
          </button>
        </div>

        {isLoggedIn && rewardReady && (
          <Card variant="crimson" className="mb-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-frsc-crimson-500/20">
                  <Coins className="size-3.5 text-frsc-crimson-400" aria-hidden="true" />
                </span>
                <div>
                  <Badge variant="crimson">Reward</Badge>
                  <p className="mt-1 text-xs text-frsc-text-300">
                    {t('profileBenefits') as string}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="crimson-gradient"
                onClick={handleClaimReward}
              >
                Claim +1 FRSC
              </Button>
            </div>
          </Card>
        )}

        {cooldown > 0 && (
          <p className="mt-2 text-[11px] text-muted-foreground tabular-nums">
            Next reward in{' '}
            {cooldownHours > 0
              ? `${cooldownHours}h ${String(cooldownMinutes).padStart(2, '0')}m`
              : `${String(cooldownMinutes).padStart(2, '0')}:${String(cooldownSeconds).padStart(2, '0')}`}
          </p>
        )}

        {!isLoggedIn && (
          <Card variant="surface" className="mb-4 border-dashed border-white/10 p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-frsc-crimson-800/20">
                <Sparkles className="size-4 text-frsc-crimson-400" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Login Required
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sign in with Google to get your FREE starter FRSC and start generating anime.
                </p>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              setEnhanced(false)
            }}
            placeholder={t('promptPlaceholder') as string}
            rows={5}
            maxLength={800}
            disabled={coins <= 0}
            className="w-full resize-none rounded-xl border border-border bg-secondary/40 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50 focus-visible:border-frsc-crimson-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
          />

          <div className="mt-1.5 flex items-center justify-end">
            <span className="text-[10px] text-frsc-text-300/70 tabular-nums tracking-wide">
              {prompt.length}/800
            </span>
          </div>

          {isLoggedIn && coins <= 0 && (
            <Card variant="crimson" className="mt-3 p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-frsc-crimson-800/30">
                  <Coins className="size-4 text-frsc-crimson-400" />
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">
                    Farisium Coin Empty
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Get FRSC or earn +1 FREE FRSC by visiting our sponsor.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="crimson-gradient"
                      onClick={handleEarnFreeCoin}
                      disabled={cooldown > 0}
                    >
                      Earn +1 FREE FRSC
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={onBuyCoins}
                      className="gap-1.5"
                    >
                      <Image src="/farisium-coin.png" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                      +FRSC
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Generate button */}
          <Button
            type="submit"
            size="lg"
            variant="crimson-gradient"
            disabled={isLoading || !prompt.trim() || coins <= 0}
            className="mt-5 h-12 w-full text-sm font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-[0.97]"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {t('generatingBtn') as string}
              </>
            ) : (
              <>
                <Search className="size-4" aria-hidden="true" />
                {t('generateBtn') as string}
              </>
            )}
          </Button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-destructive/30 bg-destructive/[0.07] p-3 text-center text-xs text-destructive/90 backdrop-blur-sm"
          >
            {error}
          </p>
        )}
      </Card>

      {/* ── Result / Queue ── */}
      <Card variant="surface" className="flex flex-col p-5 lighting-edge-top">
        {showQueue ? (
          <div className="flex flex-1 items-center justify-center">
            <QueueCard job={queueJob!} />
          </div>
        ) : (
          <>
            {/* Progress bar */}
            {isLoading && progress > 0 && (
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary relative">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out relative"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #8b0020, #e0304e, #f0506e)',
                  }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}

            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/20 aspect-[3/4] transition-all duration-300 hover:border-frsc-crimson-500/30 hover:shadow-[0_0_24px_rgba(224,48,78,0.08)]">
              {result ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.url}
                  alt={result.prompt}
                  className="h-full w-full object-cover transition-all duration-700"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <div className="relative flex size-16 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
                    <ImageIcon className="size-7 opacity-30" aria-hidden="true" />
                    <span
                      className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-frsc-crimson-500/50 animate-ping"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm text-frsc-text-200">{t('resultPlaceholder') as string}</p>
                </div>
              )}
            </div>

            {result && (
              <div className="mt-4 flex justify-end animate-fade-in">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadImage}
                  className="gap-1.5 transition-all duration-300 hover:border-frsc-crimson-500/40 hover:text-frsc-crimson-300 active:scale-95"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  {t('downloadBtn') as string}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
