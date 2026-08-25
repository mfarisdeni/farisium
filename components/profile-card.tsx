'use client'

import {
  Coins,
  Search,
  User as UserIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AuthState } from '@/hooks/useAuth'
import { useLang } from '@/hooks/useLang'
import { Card } from '@/components/ui/Card'
import { clearRewardState } from '@/lib/rewards'
import type { ReactNode } from 'react'

export function ProfileCard({
  auth,
  generations,
  coins,
  onBuyCoins,
  generationsLabel,
  generationsIcon,
}: {
  auth: AuthState
  generations: number
  coins: number
  onBuyCoins: () => void
  generationsLabel?: string
  generationsIcon?: ReactNode
})
{
  const { user, configured, signIn, logOut } = auth
  const { t } = useLang()

  const handleLogOut = async () => {
    clearRewardState()
    await logOut()
  }

  return (
    <Card variant="surface" className="p-5 lighting-edge-top">
      {/* User info */}
      <div className="flex items-center gap-3">
        {user?.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'User avatar'}
            loading="lazy"
            className="size-12 rounded-full border-2 border-frsc-surface-600 object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full border-2 border-frsc-surface-600 bg-frsc-surface-700 text-muted-foreground">
            <UserIcon className="size-5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {user?.displayName ?? (t('profileGuest') as string)}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? (t('profileNotSignedIn') as string)}
          </p>
        </div>
      </div>

      {user && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogOut}
          className="mt-2 h-8 w-full border-red-500/20 text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 active:scale-95"
        >
          Logout
        </Button>
      )}

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Card variant="crimson" className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-frsc-text-300">
            <img
              src="/farisium-coin.png"
              alt="FRSC"
              loading="lazy"
              className="h-5 w-5"
            />
            Farisium Coin
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-frsc-crimson-300">
            {coins} FRSC
          </p>
        </Card>

        {/* Characters / Captions created count */}
        <div className="rounded-xl border border-border bg-frsc-surface-700/50 p-3 transition-all duration-300 hover:border-frsc-crimson-500/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {generationsIcon ?? <Search className="size-3.5 text-frsc-crimson-400" aria-hidden="true" />}
            {generationsLabel ?? (t('profileCreated') as string)}
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{generations}</p>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={onBuyCoins}
          variant="crimson-gradient"
          size="lg"
          className="w-full rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
        >
          <div className="flex items-center gap-3">
            <img
              src="/farisium-coin.png"
              alt="FRSC"
              loading="lazy"
              className="h-8 w-8 object-contain"
            />

            <div className="flex flex-col items-start">
              <span className="text-sm font-bold">
                Top Up Farisium Coin
              </span>

              <span className="text-xs text-white/70">
                +FRSC
              </span>
            </div>
          </div>
        </Button>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          1 FRSC = 1 Generate
        </p>
      </div>
    </Card>
  )
}
