'use client'

import { useEffect, useState } from 'react'

export function useCountdown(initialSeconds: number, start: boolean = true) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(start)

  useEffect(() => {
    if (!isRunning || seconds <= 0) return

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isRunning, seconds])

  const reset = (newSeconds?: number) => {
    setSeconds(newSeconds ?? initialSeconds)
    setIsRunning(true)
  }

  const pause = () => setIsRunning(false)
  const resume = () => setIsRunning(true)

  return { seconds, isRunning, isComplete: seconds <= 0, reset, pause, resume }
}
