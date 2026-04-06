"use client"

import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import type { Bill } from "@/types"

type Props = {
  bill: Bill
}

export function BillSlider({ bill }: Props) {
  const { dispatch } = useAppState()
  const base = bill.amount
  const value = bill.adjustedAmount ?? base
  const isAdjusted = bill.adjustedAmount !== undefined && bill.adjustedAmount !== base
  const pct = base > 0 ? Math.round((value / base) * 100) : 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = parseFloat(e.target.value)
    dispatch({
      type: "UPDATE_BILL_SLIDER",
      payload: { id: bill.id, adjustedAmount: next === base ? undefined : next },
    })
  }

  function handleDoubleClick() {
    dispatch({ type: "UPDATE_BILL_SLIDER", payload: { id: bill.id, adjustedAmount: undefined } })
  }

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "var(--text-muted)" }}>Spend adjustment</span>
        <span
          className="font-mono-num"
          style={{ color: isAdjusted ? "var(--accent)" : "var(--text-muted)" }}
        >
          {isAdjusted
            ? `→ ${formatCurrency(value, bill.currency)}`
            : formatCurrency(base, bill.currency)}
        </span>
      </div>

      <div onDoubleClick={handleDoubleClick} title="Double-click to reset">
        <input
          type="range"
          min={0}
          max={base * 2 || 1}
          step={Math.max(base * 0.01, 0.01)}
          value={value}
          onChange={handleChange}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${isAdjusted ? "var(--accent)" : "var(--text-muted)"} ${pct / 2}%, var(--border) ${pct / 2}%)`,
            accentColor: "var(--accent)",
          }}
        />
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {pct}% of base · double-click to reset
      </p>
    </div>
  )
}
