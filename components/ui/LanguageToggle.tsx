'use client'

import { Languages } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { Button } from '@/components/ui/button'

interface LanguageToggleProps {
  lang: Lang
  onToggle: (lang: Lang) => void
}

export function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  const nextLang: Lang = lang === 'id' ? 'en' : 'id'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle(nextLang)}
      aria-label={`Switch language to ${nextLang === 'id' ? 'Indonesia' : 'English'}`}
    >
      <Languages className="h-4 w-4 mr-1.5" />
      <span className="text-xs font-medium uppercase">{lang}</span>
    </Button>
  )
}
