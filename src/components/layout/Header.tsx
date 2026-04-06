"use client"

import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppState } from "@/hooks/useAppState"
import { useLock } from "@/context/LockContext"

const COMMON_CURRENCIES = ["EUR", "USD", "GBP", "BRL", "JPY", "CHF", "CAD", "AUD", "SEK", "NOK"]

export function Header() {
  const { state, dispatch } = useAppState()
  const { lock } = useLock()

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--accent)", fontFamily: "var(--font-sans)" }}
        >
          SurviveX
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Base
          </span>
          <Select
            value={state.baseCurrency}
            onValueChange={(v) => { if (v !== null) dispatch({ type: "SET_BASE_CURRENCY", payload: v }) }}
          >
            <SelectTrigger
              className="w-24 h-8 text-xs"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              {COMMON_CURRENCIES.map((c) => (
                <SelectItem key={c} value={c} className="text-xs" style={{ color: "var(--text-primary)" }}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={lock}
          className="h-8 w-8"
          style={{ color: "var(--text-muted)" }}
          title="Lock vault"
        >
          <Lock className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
