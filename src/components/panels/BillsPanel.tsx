"use client"

import { Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import { AddBillForm } from "@/components/forms/AddBillForm"
import { BillSlider } from "@/components/bills/BillSlider"
import type { Bill } from "@/types"

const FREQ_LABELS: Record<string, string> = {
  monthly: "mo",
  weekly: "wk",
  yearly: "yr",
  "one-time": "1×",
}

export function BillsPanel() {
  const { state, dispatch } = useAppState()

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Bills
        </h3>
        <AddBillForm />
      </div>

      {state.bills.length > 0 && <Separator style={{ background: "var(--border)" }} />}

      <div className="space-y-3">
        {state.bills.map((bill: Bill) => (
          <div
            key={bill.id}
            className="space-y-1"
            style={{ opacity: bill.active ? 1 : 0.5 }}
          >
            <div className="flex items-center gap-2">
              <Switch
                checked={bill.active}
                onCheckedChange={(checked) =>
                  dispatch({ type: "UPDATE_BILL", payload: { ...bill, active: checked } })
                }
                className="h-4 w-7 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                  {bill.label}
                </p>
                <p className="text-xs font-mono-num" style={{ color: "var(--text-secondary)" }}>
                  {formatCurrency(bill.amount, bill.currency)}
                  {bill.date && (
                    <span style={{ color: "var(--text-muted)" }}> · {bill.date.slice(0, 7)}</span>
                  )}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs shrink-0"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {FREQ_LABELS[bill.frequency]}
              </Badge>
              <div className="flex gap-1">
                <AddBillForm
                  existing={bill}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  style={{ color: "var(--danger)" }}
                  onClick={() => dispatch({ type: "DELETE_BILL", payload: bill.id })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {bill.active && <BillSlider bill={bill} />}
          </div>
        ))}
      </div>

      {state.bills.length === 0 && (
        <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>
          No bills yet. Add recurring expenses.
        </p>
      )}
    </div>
  )
}
