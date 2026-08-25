'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles, Shield, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { AmbientLight } from '@/components/ui/ambient-light'
import { LiquidBlobs } from '@/components/ui/LiquidBlobs'
import { GlassCard } from '@/components/ui/GlassCard'
import { SupportModal } from '@/components/support-modal'
import { staggerMedium, fadeUpItem } from '@/lib/motion'
import type { Lang } from '@/lib/translations'

interface Props {
  lang?: Lang
}

export function HeroSection({ lang = 'id' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [supportOpen, setSupportOpen] = useState(false)

  // Robust cross-browser autoplay. The `autoPlay` attribute alone often fails
  // because the browser hasn't loaded enough data yet or blocks autoplay until
  // user interaction. Strategy:
  //   1. preload="auto" → load video data aggressively.
  //   2. Try play() on mount + when `canplay` fires (enough data buffered).
  //   3. If blocked, retry on first user click (common policy workaround).
  //   4. Respect prefers-reduced-motion (pause only for those users).
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const tryPlay = () => {
      if (mq.matches || v.paused === false) return
      v.play().catch(() => {
        // Browser blocked autoplay — retry on first user gesture.
        const retry = () => { v.play().catch(() => {}) }
        document.addEventListener('click', retry, { once: true })
        document.addEventListener('touchstart', retry, { once: true })
      })
    }

    tryPlay()
    v.addEventListener('canplay', tryPlay)

    const onMqChange = () => {
      if (mq.matches) { v.pause() } else { tryPlay() }
    }
    mq.addEventListener('change', onMqChange)

    return () => {
      v.removeEventListener('canplay', tryPlay)
      mq.removeEventListener('change', onMqChange)
    }
  }, [])

  const labels = {
    id: {
      badge: 'Platform AI Terpadu',
      heading: 'Satu Platform, ',
      headingAccent: 'Berbagai Layanan AI',
      description: 'Farisium menggabungkan berbagai layanan berbasis Artificial Intelligence ke dalam satu ekosistem yang modern, cepat, dan mudah digunakan.',
      ctaPrimary: 'Jelajahi AI Tools',
      features: [
        { icon: Sparkles, value: 'FRSC', label: 'Tukar Reward' },
        { icon: Shield, value: 'Self-hosted', label: 'AI inference' },
        { icon: Trophy, value: 'Menangkan', label: 'Kompetisi' },
      ],
      videoCaption: 'Farisium FRSC — Utility point ecosystem',
    },
    en: {
      badge: 'Integrated AI Platform',
      heading: 'One Platform, ',
      headingAccent: 'Multiple AI Services',
      description: 'Farisium combines various Artificial Intelligence services into a modern, fast, and easy-to-use ecosystem.',
      ctaPrimary: 'Explore AI Tools',
      features: [
        { icon: Sparkles, value: 'FRSC', label: 'Claim Reward' },
        { icon: Shield, value: 'Self-hosted', label: 'AI inference' },
        { icon: Trophy, value: 'Win', label: 'Competitions' },
      ],
      videoCaption: 'Farisium FRSC — Utility point ecosystem',
    },
  }

  const label = labels[lang] ?? labels.id
  return (
    <>
    <section className="relative min-h-[90dvh] flex items-center overflow-hidden px-4 pt-24 pb-20 sm:pt-28 sm:pb-32">
      {/* Layer 1: Ambient gradient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-[70vh] w-[50vw] hero-glow opacity-80" />
        <div className="absolute -right-32 top-1/3 h-[60vh] w-[40vw] hero-glow-purple opacity-60" />
      </div>

      {/* Layer 2: Floating liquid objects */}
      <LiquidBlobs variant="hero" />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(224,48,78,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(100,47,127,0.12) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ===== CONTENT ===== */}
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          variants={staggerMedium}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          {/* ── LEFT COLUMN ── */}
          <div className="relative z-10 max-w-xl">
            <motion.h1
              variants={fadeUpItem}
              className="heading-fluid text-hero font-medium text-foreground"
            >
              {label.heading}
              <span className="animated-gradient-text bg-clip-text text-transparent">
                {label.headingAccent}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpItem}
              className="mt-4 text-balance text-base leading-relaxed text-frsc-text-200 sm:text-lg"
            >
              {label.description}
            </motion.p>

            <motion.div
              variants={fadeUpItem}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/ai"
                className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-frsc-crimson-800 via-frsc-crimson-700 to-frsc-crimson-600 bg-[length:200%_100%] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.10)] transition-all duration-300 hover:bg-[length:100%_100%] hover:shadow-[0_0_28px_rgba(224,48,78,0.35),0_1px_0_rgba(255,255,255,0.15)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 2s ease-in-out infinite',
                }} />
                <span className="relative z-[1] flex items-center gap-2">
                  {label.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setSupportOpen(true)}
                className="group/btn inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent px-6 py-3.5 text-sm font-semibold text-frsc-text-100 shadow-metallic transition-all duration-300 hover:border-frsc-crimson-500/30 hover:from-frsc-crimson-900/10 hover:to-transparent hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-frsc-crimson-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Image src="/farisium-coin.png" alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                +FRSC
              </button>
            </motion.div>

            <motion.div
              variants={fadeUpItem}
              className="mt-8 flex flex-wrap items-center gap-2 text-xs"
            >
              {label.features.map(({ icon: Icon, value, label: l }) => (
                <GlassCard
                  key={value}
                  variant="subtle"
                  blur="light"
                  withReflection={false}
                  withAccent="none"
                  className="group whitespace-nowrap px-2.5 py-1.5"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ring-1 ring-white/10 transition-all duration-300 group-hover:bg-frsc-crimson-800/20 group-hover:ring-frsc-crimson-500/30">
                      <Icon className="h-2.5 w-2.5 text-frsc-text-200 transition-colors duration-300 group-hover:text-frsc-crimson-400" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-frsc-white-bright">{value}</span>
                      <span className="text-[10px] text-frsc-text-200/70">{l}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Video with cursor-reactive ambient light ── */}
          <motion.div
            variants={fadeUpItem}
            className="relative z-0 flex items-center justify-center"
          >
            <AmbientLight color="crimson" intensity={0.1} className="w-full">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Outer glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-2xl bg-gradient-to-br from-frsc-crimson-500/10 via-transparent to-frsc-purple-500/10 blur-2xl"
                />

                {/* Video container — liquid glass panel */}
                <GlassCard variant="default" blur="medium" withShimmer={true} className="overflow-hidden rounded-xl sm:rounded-2xl !p-0 border-0">
                  {/* Browser chrome */}
                  <div className="relative z-[2] flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="size-2 rounded-full bg-white/20" />
                    <span className="size-2 rounded-full bg-white/20" />
                    <span className="size-2 rounded-full bg-white/20" />
                    <span className="ml-2 truncate rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[9px] text-white/50 sm:ml-3 sm:px-3 sm:py-1 sm:text-[10px]">
                      farisium.com
                    </span>
                  </div>

                  {/* Video */}
                  <div className="relative z-[2]">
                    <video
                      ref={videoRef}
                      src="/farisium-frsc-web.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full"
                      aria-label="Farisium FRSC platform demo"
                    />

                    {/* Foreground layer — elegant abstract shapes */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                    >
                      {/* Diagonal light streak — top-left */}
                      <div
                        className="absolute -left-12 -top-12 h-40 w-64 rotate-[25deg] bg-gradient-to-r from-transparent via-frsc-crimson-400/8 to-transparent blur-[40px] animate-shimmer"
                        style={{ animationDelay: '0.5s' }}
                      />

                      {/* Diagonal light streak — bottom-right from purple */}
                      <div
                        className="absolute -bottom-8 -right-8 h-32 w-48 rotate-[30deg] bg-gradient-to-l from-transparent via-frsc-purple-400/6 to-transparent blur-[30px] animate-shimmer"
                        style={{ animationDelay: '1.5s' }}
                      />

                      {/* Floating subtle accent — top-right corner */}
                      <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-gradient-to-br from-frsc-purple-500/8 to-transparent blur-xl animate-float-slow" />

                      {/* Thin elegant overlay line — horizontal */}
                      <div className="absolute left-[15%] right-[15%] top-1/3 h-px bg-gradient-to-r from-transparent via-frsc-crimson-400/10 to-transparent" />

                      {/* Thin elegant overlay line — vertical */}
                      <div className="absolute top-[20%] bottom-[20%] left-1/3 w-px bg-gradient-to-b from-transparent via-frsc-purple-400/8 to-transparent" />

                      {/* Subtle corner accent — bottom-left */}
                      <div className="absolute bottom-4 left-4 h-12 w-px bg-gradient-to-t from-frsc-crimson-400/15 to-transparent" />
                      <div className="absolute bottom-4 left-4 h-px w-12 bg-gradient-to-r from-frsc-crimson-400/15 to-transparent" />
                    </div>
                  </div>
                </GlassCard>

                <p className="mt-2 text-center text-[10px] text-frsc-text-300/40 sm:text-xs sm:text-left">
                  {label.videoCaption}
                </p>
              </div>
            </AmbientLight>
          </motion.div>
        </motion.div>
      </div>
    </section>
    <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
  </>
  )
}
