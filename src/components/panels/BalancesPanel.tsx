"use client"

import { useState } from "react"
import { Trash2, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency, toBaseAmount } from "@/lib/utils"
import { AddBalanceForm } from "@/components/forms/AddBalanceForm"
import type { Balance } from "@/types"

export function BalancesPanel() {
  const { state, dispatch } = useAppState()
  const [addOpen, setAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const total = state.balances.reduce(
    (sum, b) => sum + toBaseAmount(b.amount, b.currency, state.exchangeRates, state.baseCurrency),
    0,
  )

  const editingBalance = state.balances.find((b) => b.id === editingId)

  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <AddBalanceForm open={addOpen} onOpenChange={setAddOpen} />
      {editingBalance && (
        <AddBalanceForm
          open={true}
          onOpenChange={(o) => { if (!o) setEditingId(null) }}
          existing={editingBalance}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Balances</h3>
          {state.balances.length > 0 && (
            <p className="text-xs font-mono-num" style={{ color: "var(--accent)" }}>
              Total ≈ {formatCurrency(total, state.baseCurrency)}
            </p>
          )}
        </div>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" style={{ color: "var(--accent)" }}
          onClick={() => setAddOpen(true)}>
          <Plus className="h-3 w-3 mr-1" />Add
        </Button>
      </div>

      {state.balances.length > 0 && <Separator style={{ background: "var(--border)" }} />}

      <div className="space-y-3">
        {state.balances.map((balance: Balance) => {
          const isForeign = balance.currency !== state.baseCurrency
          const converted = isForeign
            ? toBaseAmount(balance.amount, balance.currency, state.exchangeRates, state.baseCurrency)
            : null
          return (
            <div key={balance.id} className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{balance.label}</p>
                <p className="text-xs font-mono-num mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {formatCurrency(balance.amount, balance.currency)}
                </p>
                {isForeign && converted !== null && (
                  <p className="text-xs font-mono-num mt-0.5" style={{ color: "var(--text-muted)" }}>
                    ≈ {formatCurrency(converted, state.baseCurrency)}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="text-xs shrink-0 mt-0.5"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                {balance.currency}
              </Badge>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: "var(--text-muted)" }}
                  onClick={() => setEditingId(balance.id)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: "var(--danger)" }}
                  onClick={() => dispatch({ type: "DELETE_BALANCE", payload: balance.id })}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {state.balances.length === 0 && (
        <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>
          No balances yet. Add your savings accounts.
        </p>
      )}
    </div>
  )
}
