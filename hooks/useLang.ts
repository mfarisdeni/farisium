'use client'

import { useState, useCallback, createContext, useContext, useEffect } from 'react'
import type { Lang } from '@/lib/translations'
import { translations } from '@/lib/translations'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: keyof (typeof translations)['id']) => string
}

export const LangContext = createContext<LangContextValue>({
  lang: 'id',
  setLang: () => {},
  t: (key) => translations['id'][key] as string,
})

export function useLang() {
  return useContext(LangContext)
}

export function useLangState(initial: Lang = 'en') {
  const [lang, setLangState] = useState<Lang>(initial)

  useEffect(() => {
    const path = window.location.pathname
    const segments = path.split('/').filter(Boolean)
    if (segments[0] === 'id' || segments[0] === 'en') {
      setLangState(segments[0])
      return
    }

    const saved = localStorage.getItem('wf_lang')

    if (saved === 'id' || saved === 'en') {
      setLangState(saved)
      return
    }

    const browserLang = navigator.language.toLowerCase()

    if (browserLang.startsWith('id')) {
      setLangState('id')
    } else {
      setLangState('en')
    }
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('wf_lang', l)
  }, [])

  const t = useCallback(
    (key: keyof (typeof translations)['id']) => {
      return translations[lang][key] as string
    },
    [lang],
  )

  return { lang, setLang, t }
}