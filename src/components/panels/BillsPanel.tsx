"use client"

import { useState } from "react"
import { Trash2, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency, toBaseAmount } from "@/lib/utils"
import { AddBillForm } from "@/components/forms/AddBillForm"
import { BillSlider } from "@/components/bills/BillSlider"
import type { Bill } from "@/types"

const FREQ_LABELS: Record<string, string> = {
  monthly: "mo", weekly: "wk", yearly: "yr", "one-time": "1×",
}

export function BillsPanel() {
  const { state, dispatch } = useAppState()
  const [addOpen, setAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingBill = state.bills.find((b) => b.id === editingId)

  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <AddBillForm open={addOpen} onOpenChange={setAddOpen} />
      {editingBill && (
        <AddBillForm
          open={true}
          onOpenChange={(o) => { if (!o) setEditingId(null) }}
          existing={editingBill}
        />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Bills</h3>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" style={{ color: "var(--accent)" }}
          onClick={() => setAddOpen(true)}>
          <Plus className="h-3 w-3 mr-1" />Add
        </Button>
      </div>

      {state.bills.length > 0 && <Separator style={{ background: "var(--border)" }} />}

      <div className="space-y-4">
        {state.bills.map((bill: Bill) => (
          <div key={bill.id} className="space-y-1" style={{ opacity: bill.active ? 1 : 0.45 }}>
            <div className="flex items-center gap-3">
              <Switch
                checked={bill.active}
                onCheckedChange={(checked) => dispatch({ type: "UPDATE_BILL", payload: { ...bill, active: checked } })}
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{bill.label}</p>
                <p className="text-xs font-mono-num mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {formatCurrency(bill.amount, bill.currency)}
                  {bill.date && <span style={{ color: "var(--text-muted)" }}> · {bill.date.slice(0, 7)}</span>}
                </p>
                {bill.currency !== state.baseCurrency && (
                  <p className="text-xs font-mono-num mt-0.5" style={{ color: "var(--text-muted)" }}>
                    ≈ {formatCurrency(
                      toBaseAmount(bill.adjustedAmount ?? bill.amount, bill.currency, state.exchangeRates, state.baseCurrency),
                      state.baseCurrency
                    )}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="text-xs shrink-0"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                {FREQ_LABELS[bill.frequency]}
              </Badge>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: "var(--text-muted)" }}
                  onClick={() => setEditingId(bill.id)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: "var(--danger)" }}
                  onClick={() => dispatch({ type: "DELETE_BILL", payload: bill.id })}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {bill.active && <BillSlider bill={bill} />}
          </div>
        ))}
      </div>

      {state.bills.length === 0 && (
        <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>
          No bills yet. Add recurring expenses.
        </p>
      )}
    </div>
  )
}
