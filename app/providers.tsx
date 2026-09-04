'use client'

import { useState, useCallback, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import type { Lang } from '@/lib/translations'
import { translations } from '@/lib/translations'
import { LangContext } from '@/hooks/useLang'
import { COOKIE_NAME } from '@/lib/i18n'

interface ProvidersProps {
  children: React.ReactNode
  initialLang: Lang
}

export function Providers({ children, initialLang }: ProvidersProps) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`),
    )
    if (match && (match[1] === 'id' || match[1] === 'en')) {
      setLangState(match[1] as Lang)
    }
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    document.cookie = `${COOKIE_NAME}=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    localStorage.setItem('wf_lang', l)
  }, [])

  const t = useCallback(
    (key: keyof (typeof translations)['id']) =>
      translations[lang][key] as string,
    [lang],
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LangContext.Provider value={{ lang, setLang, t }}>
        {children}
      </LangContext.Provider>
    </ThemeProvider>
  )
}
