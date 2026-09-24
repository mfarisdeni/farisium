'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  active: boolean
}

/**
 * Lightweight plexus (network nodes + connecting lines) for the hero
 * background. Performance safeguards:
 * - buffer resolution capped (max 1100px CSS width × devicePixelRatio ≤ 2)
 * - render throttled to ~30fps (every other animation frame)
 * - pauses while the tab is hidden or the hero is off-screen
 * - `prefers-reduced-motion` → draws one static frame and stops
 */
export function PlexusCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const context = el.getContext('2d')
    if (!context) return
    const canvas: HTMLCanvasElement = el
    const ctx: CanvasRenderingContext2D = context

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const LINK_DIST = 120
    const MAX_BUFFER_WIDTH = 1100

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let frame = 0
    let visible = true
    let nodes: Node[] = []

    function spawnNodes() {
      const count = Math.max(20, Math.min(60, Math.floor(width / 18)))
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 0.9 + 1,
        active: i < Math.max(2, Math.floor(count / 14)),
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      // Connecting lines — purple, fades with distance.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(100, 47, 127, ${(1 - dist / LINK_DIST) * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Nodes — crimson; "agent" nodes get a soft halo.
      for (const n of nodes) {
        if (n.active) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(224, 48, 78, 0.06)'
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.active ? n.r * 1.6 : n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.active ? 'rgba(224, 48, 78, 0.9)' : 'rgba(224, 48, 78, 0.45)'
        ctx.fill()
      }
      ctx.restore()
    }

    function step() {
      if (frame % 2 === 0 && visible) {
        for (const n of nodes) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > width) n.vx *= -1
          if (n.y < 0 || n.y > height) n.vy *= -1
        }
        draw()
      }
      frame++
      raf = requestAnimationFrame(step)
    }

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect()
      width = Math.min(Math.max(rect?.width ?? 1, 1), MAX_BUFFER_WIDTH)
      height = rect?.height ?? 480
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      spawnNodes()
      draw()
    }

    resize()
    if (prefersReduced) {
      draw()
      return
    }

    raf = requestAnimationFrame(step)

    const onVisibility = () => {
      visible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
      })
      observer.observe(canvas)
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      observer?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}