"use client"

import { useEffect, useState, useCallback } from "react"
import { vaultExists } from "@/lib/crypto"
import { useAppState } from "@/hooks/useAppState"
import { LockProvider } from "@/context/LockContext"
import { CreateVault } from "@/components/auth/CreateVault"
import { UnlockVault } from "@/components/auth/UnlockVault"

type Mode = "loading" | "create" | "unlock" | "unlocked"

export function VaultGate({ children }: { children: React.ReactNode }) {
  const { clearState } = useAppState()
  const [mode, setMode] = useState<Mode>("loading")

  useEffect(() => {
    vaultExists().then((exists) => {
      setMode(exists ? "unlock" : "create")
    })
  }, [])

  const handleUnlocked = useCallback(() => {
    setMode("unlocked")
  }, [])

  const lock = useCallback(() => {
    clearState()
    setMode("unlock")
  }, [clearState])

  if (mode === "loading") {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          Loading…
        </div>
      </div>
    )
  }

  if (mode === "create") {
    return <CreateVault onSuccess={handleUnlocked} />
  }

  if (mode === "unlock") {
    return <UnlockVault onSuccess={handleUnlocked} />
  }

  return <LockProvider lock={lock}>{children}</LockProvider>
}
