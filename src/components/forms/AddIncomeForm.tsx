"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppState } from "@/hooks/useAppState"
import type { Income, IncomeFrequency } from "@/types"

const COMMON_CURRENCIES = ["EUR", "USD", "GBP", "BRL", "JPY", "CHF", "CAD", "AUD", "SEK", "NOK"]

const FREQUENCIES: { value: IncomeFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "one-time", label: "One-time" },
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  existing?: Income
}

export function AddIncomeForm({ open, onOpenChange, existing }: Props) {
  const { dispatch, state } = useAppState()
  const [frequency, setFrequency] = useState<IncomeFrequency>(existing?.frequency ?? "monthly")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const label = (fd.get("label") as string).trim()
    const amount = parseFloat(fd.get("amount") as string)
    const currency = fd.get("currency") as string
    const date = fd.get("date") as string | null
    if (!label || isNaN(amount) || amount <= 0) return
    if (frequency === "one-time" && !date) return

    if (existing) {
      dispatch({
        type: "UPDATE_INCOME",
        payload: { ...existing, label, amount, currency, frequency, date: frequency === "one-time" ? (date ?? undefined) : undefined },
      })
    } else {
      dispatch({
        type: "ADD_INCOME",
        payload: {
          id: crypto.randomUUID(), label, amount, currency, frequency,
          date: frequency === "one-time" ? (date ?? undefined) : undefined,
        },
      })
      if (currency !== state.baseCurrency) {
        dispatch({ type: "UPSERT_EXCHANGE_RATE", payload: { from: currency, to: state.baseCurrency, rate: 1 } })
      }
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
        <SheetHeader>
          <SheetTitle style={{ color: "var(--text-primary)" }}>
            {existing ? "Edit income" : "Add income"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-4 pb-6 mt-2">
          <div className="space-y-2">
            <Label style={{ color: "var(--text-secondary)" }}>Label</Label>
            <Input name="label" defaultValue={existing?.label} placeholder="e.g. Freelance payment"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          </div>

          <div className="space-y-2">
            <Label style={{ color: "var(--text-secondary)" }}>Amount</Label>
            <Input name="amount" type="number" defaultValue={existing?.amount} placeholder="0.00" min="0" step="0.01"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }} />
          </div>

          <div className="space-y-2">
            <Label style={{ color: "var(--text-secondary)" }}>Currency</Label>
            <Select name="currency" defaultValue={existing?.currency ?? state.baseCurrency}>
              <SelectTrigger style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                {COMMON_CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c} style={{ color: "var(--text-primary)" }}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label style={{ color: "var(--text-secondary)" }}>Frequency</Label>
            <Select name="frequency" value={frequency} onValueChange={(v) => { if (v) setFrequency(v as IncomeFrequency) }}>
              <SelectTrigger style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                {FREQUENCIES.map((f) => (
                  <SelectItem key={f.value} value={f.value} style={{ color: "var(--text-primary)" }}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {frequency === "one-time" && (
            <div className="space-y-2">
              <Label style={{ color: "var(--text-secondary)" }}>Date</Label>
              <Input name="date" type="date" defaultValue={existing?.date}
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }} />
            </div>
          )}

          <Button type="submit" className="w-full" style={{ background: "var(--accent)", color: "#09090f" }}>
            {existing ? "Save changes" : "Add income"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
