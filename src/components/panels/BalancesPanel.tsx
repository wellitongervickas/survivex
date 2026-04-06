"use client"

import { useState } from "react"
import { Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency, toBaseAmount } from "@/lib/utils"
import { AddBalanceForm } from "@/components/forms/AddBalanceForm"
import type { Balance } from "@/types"

export function BalancesPanel() {
  const { state, dispatch } = useAppState()
  const [editingId, setEditingId] = useState<string | null>(null)

  const total = state.balances.reduce(
    (sum, b) => sum + toBaseAmount(b.amount, b.currency, state.exchangeRates, state.baseCurrency),
    0,
  )

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Balances
          </h3>
          {state.balances.length > 0 && (
            <p className="text-xs font-mono-num" style={{ color: "var(--accent)" }}>
              Total ≈ {formatCurrency(total, state.baseCurrency)}
            </p>
          )}
        </div>
        <AddBalanceForm />
      </div>

      {state.balances.length > 0 && <Separator style={{ background: "var(--border)" }} />}

      <div className="space-y-2">
        {state.balances.map((balance: Balance) =>
          editingId === balance.id ? (
            <AddBalanceForm
              key={balance.id}
              existing={balance}
              onClose={() => setEditingId(null)}
              trigger={<span />}
            />
          ) : (
            <div
              key={balance.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                  {balance.label}
                </p>
                <p className="text-xs font-mono-num" style={{ color: "var(--text-secondary)" }}>
                  {formatCurrency(balance.amount, balance.currency)}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs shrink-0"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {balance.currency}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => setEditingId(balance.id)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  style={{ color: "var(--danger)" }}
                  onClick={() => dispatch({ type: "DELETE_BALANCE", payload: balance.id })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ),
        )}
      </div>

      {state.balances.length === 0 && (
        <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>
          No balances yet. Add your savings accounts.
        </p>
      )}
    </div>
  )
}
