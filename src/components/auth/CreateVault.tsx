"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppState } from "@/hooks/useAppState"
import { DEFAULT_STATE } from "@/context/AppContext"

type Props = {
  onSuccess: () => void
}

export function CreateVault({ onSuccess }: Props) {
  const { saveState, dispatch } = useAppState()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      dispatch({ type: "SET_STATE", payload: DEFAULT_STATE })
      await saveState(password)
      onSuccess()
    } catch {
      setError("Failed to create vault. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <div
        className="w-full max-w-sm rounded-xl p-8 space-y-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
            Create your vault
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your data is encrypted client-side. Choose a strong password — it cannot be recovered.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" style={{ color: "var(--text-secondary)" }}>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              autoFocus
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" style={{ color: "var(--text-secondary)" }}>
              Confirm password
            </Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            style={{ background: "var(--accent)", color: "#09090f" }}
          >
            {loading ? "Encrypting…" : "Create vault"}
          </Button>
        </form>
      </div>
    </div>
  )
}
