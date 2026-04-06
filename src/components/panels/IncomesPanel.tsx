"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import { AddIncomeForm } from "@/components/forms/AddIncomeForm"
import type { Income } from "@/types"

const FREQ_LABELS: Record<string, string> = {
  monthly: "mo",
  "one-time": "1×",
}

export function IncomesPanel() {
  const { state, dispatch } = useAppState()

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Incomes
        </h3>
        <AddIncomeForm />
      </div>

      {state.incomes.length > 0 && <Separator style={{ background: "var(--border)" }} />}

      <div className="space-y-2">
        {state.incomes.map((income: Income) => (
          <div key={income.id} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                {income.label}
              </p>
              <p className="text-xs font-mono-num" style={{ color: "var(--safe)" }}>
                +{formatCurrency(income.amount, income.currency)}
                {income.date && (
                  <span style={{ color: "var(--text-muted)" }}> · {income.date.slice(0, 7)}</span>
                )}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs shrink-0"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              {FREQ_LABELS[income.frequency]}
            </Badge>
            <AddIncomeForm
              existing={income}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="text-xs">✎</span>
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              style={{ color: "var(--danger)" }}
              onClick={() => dispatch({ type: "DELETE_INCOME", payload: income.id })}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {state.incomes.length === 0 && (
        <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>
          No incomes yet. Add freelance or scheduled inflows.
        </p>
      )}
    </div>
  )
}
