'use client'

import { useCallback, useEffect, useRef } from 'react'

interface ParallaxLayer {
  speed: number
  element: HTMLElement | null
  offsetX: number
  offsetY: number
}

export function useParallax() {
  const layers = useRef<ParallaxLayer[]>([])
  const frameId = useRef<number>(0)

  const register = useCallback((element: HTMLElement | null, speed: number, offsetX = 0, offsetY = 0) => {
    if (!element) return

    const existing = layers.current.find((l) => l.element === element)
    if (existing) {
      existing.speed = speed
      existing.offsetX = offsetX
      existing.offsetY = offsetY
      return
    }

    layers.current.push({ element, speed, offsetX, offsetY })
  }, [])

  const unregister = useCallback((element: HTMLElement | null) => {
    if (!element) return
    layers.current = layers.current.filter((l) => l.element !== element)
  }, [])

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const px = (e.clientX - cx) / cx
      const py = (e.clientY - cy) / cy

      cancelAnimationFrame(frameId.current)

      frameId.current = requestAnimationFrame(() => {
        for (const layer of layers.current) {
          if (!layer.element) continue
          const x = layer.offsetX + px * layer.speed * 20
          const y = layer.offsetY + py * layer.speed * 20
          layer.element.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frameId.current)
    }
  }, [])

  return { register, unregister }
}
