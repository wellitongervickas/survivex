"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Plus } from "lucide-react"
import { useAppState } from "@/hooks/useAppState"
import type { Balance } from "@/types"

const COMMON_CURRENCIES = ["EUR", "USD", "GBP", "BRL", "JPY", "CHF", "CAD", "AUD", "SEK", "NOK"]

type Props = {
  existing?: Balance
  onClose?: () => void
  trigger?: React.ReactElement
}

export function AddBalanceForm({ existing, onClose, trigger }: Props) {
  const { dispatch, state } = useAppState()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState(existing?.label ?? "")
  const [amount, setAmount] = useState(existing?.amount?.toString() ?? "")
  const [currency, setCurrency] = useState(existing?.currency ?? state.baseCurrency)

  function reset() {
    if (!existing) {
      setLabel("")
      setAmount("")
      setCurrency(state.baseCurrency)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!label.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return

    if (existing) {
      dispatch({
        type: "UPDATE_BALANCE",
        payload: { ...existing, label: label.trim(), amount: parsedAmount, currency },
      })
    } else {
      const newBalance: Balance = {
        id: crypto.randomUUID(),
        label: label.trim(),
        amount: parsedAmount,
        currency,
        createdAt: new Date().toISOString(),
      }
      dispatch({ type: "ADD_BALANCE", payload: newBalance })
      // Auto-add exchange rate if new currency
      if (currency !== state.baseCurrency) {
        dispatch({
          type: "UPSERT_EXCHANGE_RATE",
          payload: { from: currency, to: state.baseCurrency, rate: 1 },
        })
      }
    }

    reset()
    setOpen(false)
    onClose?.()
  }

  const defaultTrigger = (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-xs"
      style={{ color: "var(--accent)" }}
    >
      <Plus className="h-3 w-3 mr-1" />
      Add
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger ?? defaultTrigger} />
      <SheetContent
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        <SheetHeader>
          <SheetTitle style={{ color: "var(--text-primary)" }}>
            {existing ? "Edit balance" : "Add balance"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-secondary)" }}>Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Savings account"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-secondary)" }}>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-secondary)" }}>Currency</Label>
            <Select value={currency} onValueChange={(v) => { if (v !== null) setCurrency(v) }}>
              <SelectTrigger
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                {COMMON_CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c} style={{ color: "var(--text-primary)" }}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            style={{ background: "var(--accent)", color: "#09090f" }}
          >
            {existing ? "Save changes" : "Add balance"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
