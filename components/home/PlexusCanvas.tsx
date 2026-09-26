'use client'

import { useEffect, useRef } from 'react'

interface PlexusNode {
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
 * - buffer sized from the real element rect, dpr capped by a pixel budget
 *   (~3.2M device px) so a 1920px Windows desktop is sharp without a
 *   4K-sized clearRect every frame
 * - time-based throttle (~30fps) instead of frame counting, so 120/144Hz
 *   monitors do not double the fill cost
 * - pauses while the tab is hidden or the hero is off-screen
 * - `prefers-reduced-motion` → ~8fps at 18% drift speed plus a soft halo
 *   breath, so the background stays alive instead of freezing on one frame
 * - stall watchdog + visibility self-heal: if requestAnimationFrame stops
 *   being delivered (Windows occlusion tracking, GPU/compositor hiccups,
 *   bfcache restore) the loop is restarted and repainted on demand
 */
export function PlexusCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return
    const context = element.getContext('2d')
    if (!context) return
    const canvas: HTMLCanvasElement = element
    const ctx: CanvasRenderingContext2D = context

    const LINK_DIST = 120
    const MIN_NODES = 20
    const MAX_NODES = 60
    const MIN_FPS = 30
    const REDUCED_FPS = 8
    const REDUCED_SPEED = 0.18
    const PIXEL_BUDGET = 3_200_000
    const STALL_MS = 1_500
    const EDGE_MARGIN = 80

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let lastDraw = 0
    let lastStep = 0
    let inView = true
    let nodes: PlexusNode[] = []

    const minFrameMs = () => 1000 / (motionQuery.matches ? REDUCED_FPS : MIN_FPS)
    const shouldRender = () => !document.hidden && inView

    function spawnNodes() {
      const count = Math.max(MIN_NODES, Math.min(MAX_NODES, Math.floor(width / 18)))
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 0.9 + 1,
        active: i < Math.max(2, Math.floor(count / 14)),
      }))
    }

    function measure() {
      const rect = canvas.getBoundingClientRect()
      const parentRect = canvas.parentElement?.getBoundingClientRect()
      const nextWidth = Math.max(rect.width || parentRect?.width || window.innerWidth || 1, 1)
      const nextHeight = Math.max(rect.height || parentRect?.height || 480, 1)

      const resized = nextWidth !== width || nextHeight !== height
      width = nextWidth
      height = nextHeight

      const ratio = window.devicePixelRatio || 1
      dpr = Math.max(1, Math.min(ratio, 2, Math.sqrt(PIXEL_BUDGET / (width * height))))
      const bufferWidth = Math.max(1, Math.floor(width * dpr))
      const bufferHeight = Math.max(1, Math.floor(height * dpr))
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth
        canvas.height = bufferHeight
      }

      if (resized) spawnNodes()
    }

    function draw(phase: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // Connecting lines — purple, fades with distance.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist >= LINK_DIST) continue
          ctx.strokeStyle = `rgba(100, 47, 127, ${(1 - dist / LINK_DIST) * 0.3})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // Nodes — crimson; "agent" nodes get a breathing halo.
      const breath = (Math.sin(phase) + 1) / 2
      for (const n of nodes) {
        if (n.active) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r * 4 * (1 + 0.25 * breath), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(224, 48, 78, ${0.045 + 0.035 * breath})`
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.active ? n.r * 1.6 : n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.active ? 'rgba(224, 48, 78, 0.9)' : 'rgba(224, 48, 78, 0.45)'
        ctx.fill()
      }
    }

    function render(force = false) {
      const now = performance.now()
      if (!force && now - lastDraw < minFrameMs()) return
      lastDraw = now
      draw(now / 1000)
    }

    function start() {
      cancelAnimationFrame(raf)
      lastStep = performance.now()
      raf = requestAnimationFrame(step)
    }

    function step(now: number) {
      raf = requestAnimationFrame(step)
      if (!shouldRender()) return

      const speed = motionQuery.matches ? REDUCED_SPEED : 1
      const delta = Math.min(64, now - lastStep) / 16.667
      lastStep = now

      for (const n of nodes) {
        n.x += n.vx * speed * delta
        n.y += n.vy * speed * delta
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      render()
    }

    // Self-heal for a stale IntersectionObserver: only ever re-enables
    // rendering when the element is provably inside the viewport.
    function syncInView() {
      if (document.hidden) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      if (rect.bottom > -EDGE_MARGIN && rect.top < viewportHeight + EDGE_MARGIN) {
        inView = true
      }
    }

    function revive() {
      measure()
      syncInView()
      start()
      render(true)
    }

    measure()
    syncInView()
    render(true)
    start()

    const watchdog = window.setInterval(() => {
      if (!shouldRender()) return
      if (performance.now() - lastDraw > STALL_MS) revive()
    }, STALL_MS)

    const onVisibilityChange = () => {
      if (!document.hidden) revive()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting
        },
        { rootMargin: `${EDGE_MARGIN}px 0px` },
      )
      observer.observe(canvas)
    }

    let scrollQueued = false
    const onScroll = () => {
      if (scrollQueued) return
      scrollQueued = true
      requestAnimationFrame(() => {
        scrollQueued = false
        syncInView()
        render()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onResize = () => {
      measure()
      syncInView()
      render(true)
    }
    window.addEventListener('resize', onResize)

    window.addEventListener('focus', onScroll)
    window.addEventListener('pageshow', revive)
    const onMotionChange = () => render(true)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(watchdog)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('focus', onScroll)
      window.removeEventListener('pageshow', revive)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
