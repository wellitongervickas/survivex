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
import type { Bill, BillFrequency } from "@/types"

const COMMON_CURRENCIES = ["EUR", "USD", "GBP", "BRL", "JPY", "CHF", "CAD", "AUD", "SEK", "NOK"]

const FREQUENCIES: { value: BillFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
  { value: "one-time", label: "One-time" },
]

type Props = {
  existing?: Bill
  onClose?: () => void
  trigger?: React.ReactElement
}

export function AddBillForm({ existing, onClose, trigger }: Props) {
  const { dispatch, state } = useAppState()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState(existing?.label ?? "")
  const [amount, setAmount] = useState(existing?.amount?.toString() ?? "")
  const [currency, setCurrency] = useState(existing?.currency ?? state.baseCurrency)
  const [frequency, setFrequency] = useState<BillFrequency>(existing?.frequency ?? "monthly")
  const [date, setDate] = useState(existing?.date ?? "")

  function reset() {
    if (!existing) {
      setLabel("")
      setAmount("")
      setCurrency(state.baseCurrency)
      setFrequency("monthly")
      setDate("")
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!label.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return
    if (frequency === "one-time" && !date) return

    if (existing) {
      dispatch({
        type: "UPDATE_BILL",
        payload: {
          ...existing,
          label: label.trim(),
          amount: parsedAmount,
          currency,
          frequency,
          date: frequency === "one-time" ? date : undefined,
        },
      })
    } else {
      const newBill: Bill = {
        id: crypto.randomUUID(),
        label: label.trim(),
        amount: parsedAmount,
        currency,
        frequency,
        date: frequency === "one-time" ? date : undefined,
        active: true,
      }
      dispatch({ type: "ADD_BILL", payload: newBill })
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
            {existing ? "Edit bill" : "Add bill"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-secondary)" }}>Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Rent"
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

          <div className="space-y-1.5">
            <Label style={{ color: "var(--text-secondary)" }}>Frequency</Label>
            <Select value={frequency} onValueChange={(v) => { if (v !== null) setFrequency(v as BillFrequency) }}>
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
                {FREQUENCIES.map((f) => (
                  <SelectItem key={f.value} value={f.value} style={{ color: "var(--text-primary)" }}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {frequency === "one-time" && (
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            style={{ background: "var(--accent)", color: "#09090f" }}
          >
            {existing ? "Save changes" : "Add bill"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
