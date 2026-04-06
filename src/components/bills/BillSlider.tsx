"use client"

import { Slider } from "@/components/ui/slider"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import type { Bill } from "@/types"

type Props = {
  bill: Bill
}

export function BillSlider({ bill }: Props) {
  const { dispatch } = useAppState()
  const base = bill.amount
  // Drive value from state directly — no local copy needed
  const value = bill.adjustedAmount ?? base
  const isAdjusted = bill.adjustedAmount !== undefined && bill.adjustedAmount !== base

  function handleChange(val: number | readonly number[]) {
    const next = Array.isArray(val) ? (val as number[])[0] : (val as number)
    dispatch({
      type: "UPDATE_BILL_SLIDER",
      payload: { id: bill.id, adjustedAmount: next === base ? undefined : next },
    })
  }

  function handleDoubleClick() {
    dispatch({ type: "UPDATE_BILL_SLIDER", payload: { id: bill.id, adjustedAmount: undefined } })
  }

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Adjust spending
        </span>
        <span
          className="text-xs font-mono-num"
          style={{ color: isAdjusted ? "var(--accent)" : "var(--text-muted)" }}
        >
          {isAdjusted
            ? `adjusted: ${formatCurrency(value, bill.currency)}`
            : formatCurrency(base, bill.currency)}
        </span>
      </div>
      <div onDoubleClick={handleDoubleClick} title="Double-click to reset">
        <Slider
          min={0}
          max={base * 2}
          step={Math.max(base * 0.01, 0.01)}
          value={[value]}
          onValueChange={handleChange}
          className="cursor-pointer"
        />
      </div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {base > 0 ? Math.round((value / base) * 100) : 0}% of base · double-click to reset
      </p>
    </div>
  )
}
