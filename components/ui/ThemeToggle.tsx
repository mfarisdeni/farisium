'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const THEME_COLORS: Record<string, string> = {
  light: '#ffffff',
  dark: '#0a0a0a',
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta && resolvedTheme) {
      meta.content = THEME_COLORS[resolvedTheme] ?? '#ffffff'
    }
  }, [resolvedTheme])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-subtle bg-surface-subtle text-frsc-text-200 transition-colors duration-200 hover:border-frsc-crimson-500/30 hover:text-frsc-crimson-400"
    >
      {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
