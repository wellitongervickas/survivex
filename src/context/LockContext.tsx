"use client"

import React, { createContext, useContext } from "react"

type LockContextValue = {
  lock: () => void
}

const LockContext = createContext<LockContextValue | null>(null)

export function LockProvider({
  children,
  lock,
}: {
  children: React.ReactNode
  lock: () => void
}) {
  return <LockContext.Provider value={{ lock }}>{children}</LockContext.Provider>
}

export function useLock(): LockContextValue {
  const ctx = useContext(LockContext)
  if (!ctx) throw new Error("useLock must be used within LockProvider")
  return ctx
}
