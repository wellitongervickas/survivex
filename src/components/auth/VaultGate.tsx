"use client"

import { useEffect, useState, useCallback } from "react"
import { vaultExists, tryRestoreSession, clearSession } from "@/lib/crypto"
import { useAppContext } from "@/context/AppContext"
import { LockProvider } from "@/context/LockContext"
import { CreateVault } from "@/components/auth/CreateVault"
import { UnlockVault } from "@/components/auth/UnlockVault"
import type { AppState } from "@/types"

type Mode = "loading" | "create" | "unlock" | "unlocked"

export function VaultGate({ children }: { children: React.ReactNode }) {
  const { clearState, setSession, dispatch } = useAppContext()
  const [mode, setMode] = useState<Mode>("loading")

  useEffect(() => {
    async function init() {
      const exists = await vaultExists()
      if (!exists) {
        setMode("create")
        return
      }

      // Try to restore session from sessionStorage (survives F5, not tab close)
      const restored = await tryRestoreSession()
      if (restored) {
        try {
          const parsed = JSON.parse(restored.plaintext) as AppState
          setSession(restored.session)
          dispatch({ type: "SET_STATE", payload: parsed })
          setMode("unlocked")
          return
        } catch {
          // Corrupted state — fall through to unlock screen
        }
      }

      setMode("unlock")
    }
    init()
  }, [dispatch, setSession])

  const handleUnlocked = useCallback(() => setMode("unlocked"), [])

  const lock = useCallback(() => {
    clearSession()
    setSession(null)
    clearState()
    setMode("unlock")
  }, [clearState, setSession])

  if (mode === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="text-sm animate-pulse" style={{ color: "var(--text-muted)" }}>
          Loading…
        </div>
      </div>
    )
  }

  if (mode === "create") return <CreateVault onSuccess={handleUnlocked} />
  if (mode === "unlock") return <UnlockVault onSuccess={handleUnlocked} />

  return <LockProvider lock={lock}>{children}</LockProvider>
}
