'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import {
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  BookOpen,
  Users,
  Gift,
  Trophy,
  LogOut,
  ChevronDown,
  Info,
  Mail,
} from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useFRSC } from '@/contexts/FRSCContext'
import { Logo } from '@/components/ui/Logo'

const navLinks = [
  { label: 'AI Tools', href: '/ai', icon: Sparkles },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Rewards', href: '/rewards', icon: Gift },
  { label: 'Competition', href: '/competition', icon: Trophy },
  { label: 'Partnership', href: '/partnership', icon: Users },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, loading, signIn, logOut } = useAuthContext()
  const { coins } = useFRSC()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [userMenuOpen])

  // Close user menu on Escape (keyboard accessibility)
  useEffect(() => {
    if (!userMenuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [userMenuOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-white/[0.06] bg-black/40 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)] shadow-lg shadow-black/30'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-14 sm:h-16 w-full max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center group">
            <Logo variant="white" size="xl" showText={false} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                    active
                      ? 'border-frsc-crimson-500/30 bg-frsc-crimson-800/15 text-frsc-white-bright shadow-[inset_0_1px_0_rgba(224,48,78,0.12)]'
                      : 'border-transparent text-frsc-text-300 hover:text-frsc-white-bright hover:bg-white/[0.04]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user && (
              <Link
                href="/frsc"
                className="flex items-center gap-1 rounded-xl border border-white/[0.10] bg-gradient-to-b from-white/[0.05] to-transparent px-2 py-1.5 text-sm font-semibold text-frsc-white-bright shadow-metallic transition-all duration-300 hover:border-frsc-crimson-500/30 hover:from-frsc-crimson-900/10 hover:to-transparent hover-lift sm:gap-1.5 sm:px-3"
              >
                <Image src="/farisium-coin.png" alt="" width={20} height={20} className="h-5 w-5" />
                <span>{coins} FRSC</span>
              </Link>
            )}

            {!loading && (
              user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent px-3 py-1.5 text-sm transition-all duration-200 hover:border-frsc-crimson-500/30 hover:from-frsc-crimson-900/10 hover:to-transparent min-h-[36px] shadow-metallic"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt={user.displayName ?? ''} loading="lazy" className="h-6 w-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-frsc-crimson-800/40 to-frsc-purple-800/20 text-xs font-bold text-frsc-crimson-300 ring-1 ring-frsc-crimson-700/30">
                        {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden max-w-[100px] truncate text-sm font-medium sm:block">
                      {user.displayName?.split(' ')[0] ?? 'User'}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Dropdown */}
                    {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 origin-top-right rounded-xl border border-white/[0.08] bg-frsc-surface-900 p-1 shadow-xl shadow-black/40 z-50 backdrop-blur-xl">
                      <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-frsc-text-300 hover:text-frsc-white-bright hover:bg-white/[0.06]" onClick={() => setUserMenuOpen(false)}>
                        Profile
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-frsc-text-300 hover:text-frsc-white-bright hover:bg-white/[0.06]" onClick={() => setUserMenuOpen(false)}>
                        Settings
                      </Link>
                      <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-frsc-text-300 hover:text-frsc-white-bright hover:bg-white/[0.06]" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Dashboard
                      </Link>
                      <div className="my-1 border-t border-white/[0.06]" />
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); logOut() }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={signIn}
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-1.5 text-sm font-semibold text-black transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-[0.98]"
                >
                  <img src="/google.jpg" alt="" className="h-5 w-5 shrink-0" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-black">Masuk</span>
                    <span className="text-[10px] font-normal text-black">+1 FREE FRSC</span>
                  </div>
                </button>
              )
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-frsc-text-300 transition-all duration-200 hover:text-frsc-white-bright hover:bg-white/[0.06] md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-sticky md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
          <nav
            className="absolute right-0 top-14 w-72 max-w-[calc(100vw-16px)] rounded-bl-2xl border-b border-l border-white/[0.06] bg-frsc-surface-900/95 backdrop-blur-2xl p-4 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'border-frsc-crimson-500/30 bg-frsc-crimson-800/15 text-frsc-crimson-300 shadow-[inset_0_1px_0_rgba(224,48,78,0.12)]'
                        : 'border-transparent text-frsc-text-300 hover:text-frsc-white-bright hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                )
              })}

              <div className="my-2 border-t border-white/[0.06]" />

              {user ? (
                <>
                  <Link href="/frsc" className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-frsc-text-300 hover:text-frsc-white-bright hover:bg-white/[0.06]" onClick={() => setMobileOpen(false)}>
                    <Image src="/farisium-coin.png" alt="" width={20} height={20} className="h-5 w-5" />
                    {coins} FRSC
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); logOut() }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={signIn}
                  className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition-all hover:bg-zinc-100"
                >
                  <img src="/google.jpg" alt="" className="h-5 w-5 shrink-0" />
                  Masuk dengan Google
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
