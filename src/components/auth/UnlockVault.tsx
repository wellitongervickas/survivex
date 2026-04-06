"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppContext } from "@/context/AppContext"
import { unlockVault } from "@/lib/crypto"
import type { AppState } from "@/types"

type Props = {
  onSuccess: () => void
}

export function UnlockVault({ onSuccess }: Props) {
  const { dispatch, setSession } = useAppContext()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { session, plaintext } = await unlockVault(password)
      const parsed = JSON.parse(plaintext) as AppState
      // Arm session key before dispatching state so auto-save fires correctly
      setSession(session)
      dispatch({ type: "SET_STATE", payload: parsed })
      onSuccess()
    } catch {
      setError("Wrong password or corrupted vault. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <div
        className="w-full max-w-sm mx-4 sm:mx-auto rounded-xl p-8 space-y-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
            Unlock your vault
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Enter your password to decrypt and load your financial data.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label style={{ color: "var(--text-secondary)" }}>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your vault password"
              autoFocus
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            style={{ background: "var(--accent)", color: "#09090f" }}
          >
            {loading ? "Decrypting…" : "Unlock"}
          </Button>
        </form>
      </div>
    </div>
  )
}
