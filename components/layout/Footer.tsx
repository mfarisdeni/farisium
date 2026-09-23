'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { useLang } from '@/hooks/useLang'
import type { Lang } from '@/lib/translations'

const footerLinks = {
  'AI Tools': [
    { label: 'Struk ke Excel', href: '/ai/receipt-to-excel' },
    { label: 'Foto ke Invoice', href: '/ai/image-to-invoice' },
    { label: 'AI Directory', href: '/ai' },
  ],
  Platform: [
    { label: 'Rewards', href: '/rewards' },
    { label: 'FRSC', href: '/frsc' },
    { label: 'Partnership', href: '/partnership' },
    { label: 'Community', href: '/community' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Syarat & Ketentuan', href: '/terms' },
    { label: 'Kebijakan Privasi', href: '/privacy' },
    { label: 'Kebijakan Cookie', href: '/cookie-policy' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
}

const groupLabels: Record<Lang, Record<string, string>> = {
  id: { 'AI Tools': 'AI Tools', Platform: 'Platform', Akun: 'Akun', Legal: 'Legal' },
  en: { 'AI Tools': 'AI Tools', Platform: 'Platform', Akun: 'Account', Legal: 'Legal' },
}

const linkLabels: Record<Lang, Record<string, string>> = {
  id: {
    'Syarat & Ketentuan': 'Syarat & Ketentuan',
    'Kebijakan Privasi': 'Kebijakan Privasi',
    'AI Directory': 'AI Directory',
    'Struk ke Excel': 'Struk ke Excel',
    'Foto ke Invoice': 'Foto ke Invoice',
    Rewards: 'Rewards',
    FRSC: 'FRSC',
    Partnership: 'Partnership',
    Community: 'Komunitas',
    Blog: 'Blog',
    Dashboard: 'Dashboard',
    Profile: 'Profile',
    Settings: 'Settings',
    'Kebijakan Cookie': 'Kebijakan Cookie',
    FAQ: 'FAQ',
    Disclaimer: 'Disclaimer',
  },
  en: {
    'Syarat & Ketentuan': 'Terms & Conditions',
    'Kebijakan Privasi': 'Privacy Policy',
    'Kebijakan Cookie': 'Cookie Policy',
    'AI Directory': 'AI Directory',
    'Struk ke Excel': 'Receipt to Excel',
    'Foto ke Invoice': 'Image to Invoice',
    Rewards: 'Rewards',
    FRSC: 'FRSC',
    Partnership: 'Partnership',
    Community: 'Community',
    Blog: 'Blog',
    Dashboard: 'Dashboard',
    Profile: 'Profile',
    Settings: 'Settings',
    FAQ: 'FAQ',
    Disclaimer: 'Disclaimer',
  },
}

const accountLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Settings', href: '/settings' },
]

export function Footer() {
  const { lang } = useLang()

  const labels = {
    id: {
      brand: 'Platform AI terpadu. Berbagai layanan berbasis Artificial Intelligence dalam satu ekosistem.',
      disclaimer: 'FRSC bukan mata uang dan bukan instrumen investasi.',
      copyright: `\u00A9 ${new Date().getFullYear()} Farisium — farisium.com`,
    },
    en: {
      brand: 'Integrated AI platform. Multiple Artificial Intelligence services in one ecosystem.',
      disclaimer: 'FRSC is not a currency and not an investment instrument.',
      copyright: `\u00A9 ${new Date().getFullYear()} Farisium — farisium.com`,
    },
  }

  const label = labels[lang] ?? labels.id
  const gLabels = groupLabels[lang] ?? groupLabels.id
  const lLabels = linkLabels[lang] ?? linkLabels.id

  return (
    <footer className="relative mt-24">
      {/* Premium gradient top separator */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4 group">
              <Logo variant="white" size="lg" showText={false} />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-frsc-text-200 text-pretty">
              {label.brand}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="eyebrow-label mb-4 text-[10px] text-frsc-white-bright/50">
                {gLabels[group] ?? group}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label: linkLabel, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-frsc-text-200 transition-colors duration-200 hover:text-frsc-white-bright"
                    >
                      {lLabels[linkLabel] ?? linkLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Akun group */}
          <div>
            <h3 className="eyebrow-label mb-4 text-[10px] text-frsc-white-bright/50">
              {gLabels['Akun'] ?? 'Akun'}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {accountLinks.map(({ label: linkLabel, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-frsc-text-200 transition-colors duration-200 hover:text-frsc-white-bright"
                  >
                    {lLabels[linkLabel] ?? linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-frsc-text-200">
            {label.copyright}
          </p>
          <div className="flex items-center gap-3 text-xs text-frsc-text-200">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-consent'))}
              className="transition-colors duration-200 hover:text-frsc-white-bright"
            >
              {lang === 'id' ? 'Kelola Preferensi Cookie' : 'Manage Cookie Preferences'}
            </button>
            <span aria-hidden="true">·</span>
            <p>{label.disclaimer}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
