'use client'

import { Navbar } from '@/components/layout/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { LegalContent } from '@/components/legal/legal-content'
import { LangContext, useLangState } from '@/hooks/useLang'

export default function TermsPage() {
  const langState = useLangState()

  return (
    <LangContext.Provider value={langState}>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1">
          <LegalContent type="terms" />
        </main>
        <SiteFooter />
      </div>
    </LangContext.Provider>
  )
}
