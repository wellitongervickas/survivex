"use client"

import { useMemo } from "react"
import { useAppState } from "@/hooks/useAppState"
import { simulate, computeSafeThreshold } from "@/lib/simulate"
import type { MonthlySnapshot } from "@/types"

export function useSimulation(): {
  snapshots: MonthlySnapshot[]
  safeThreshold: number
  decisionSnapshot: MonthlySnapshot | undefined
} {
  const { state } = useAppState()

  return useMemo(() => {
    const snapshots = simulate(state)
    const safeThreshold = computeSafeThreshold(state)
    const decisionSnapshot = snapshots.find((s) => s.isDecisionMonth)
    return { snapshots, safeThreshold, decisionSnapshot }
  }, [state])
}
