"use client"

import { useState } from "react"
import { Trash2, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import { AddIncomeForm } from "@/components/forms/AddIncomeForm"
import type { Income } from "@/types"

const FREQ_LABELS: Record<string, string> = {
  monthly: "mo", "one-time": "1×",
}

export function IncomesPanel() {
  const { state, dispatch } = useAppState()
  const [addOpen, setAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingIncome = state.incomes.find((i) => i.id === editingId)

  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <AddIncomeForm open={addOpen} onOpenChange={setAddOpen} />
      {editingIncome && (
        <AddIncomeForm
          open={true}
          onOpenChange={(o) => { if (!o) setEditingId(null) }}
          existing={editingIncome}
        />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Incomes</h3>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" style={{ color: "var(--accent)" }}
          onClick={() => setAddOpen(true)}>
          <Plus className="h-3 w-3 mr-1" />Add
        </Button>
      </div>

      {state.incomes.length > 0 && <Separator style={{ background: "var(--border)" }} />}

      <div className="space-y-3">
        {state.incomes.map((income: Income) => (
          <div key={income.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{income.label}</p>
              <p className="text-xs font-mono-num mt-0.5" style={{ color: "var(--safe)" }}>
                +{formatCurrency(income.amount, income.currency)}
                {income.date && <span style={{ color: "var(--text-muted)" }}> · {income.date.slice(0, 7)}</span>}
              </p>
            </div>
            <Badge variant="outline" className="text-xs shrink-0"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              {FREQ_LABELS[income.frequency]}
            </Badge>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: "var(--text-muted)" }}
                onClick={() => setEditingId(income.id)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: "var(--danger)" }}
                onClick={() => dispatch({ type: "DELETE_INCOME", payload: income.id })}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {state.incomes.length === 0 && (
        <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>
          No incomes yet. Add freelance or scheduled inflows.
        </p>
      )}
    </div>
  )
}
