"use client"

import { useEffect, useRef, useState } from "react"

export function useCountUp(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target)
  const startRef = useRef(target)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = display
    startTimeRef.current = null

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    const from = startRef.current
    const to = target

    function step(timestamp: number) {
      if (startTimeRef.current === null) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(from + (to - from) * progress)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(to)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return display
}
