"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency, toBaseAmount } from "@/lib/utils"

export function SafePointPanel() {
  const { state, dispatch } = useAppState()
  const [inputValue, setInputValue] = useState(String(state.safePoint.value))

  const totalBalance = state.balances.reduce(
    (sum, b) => sum + toBaseAmount(b.amount, b.currency, state.exchangeRates, state.baseCurrency),
    0,
  )

  const threshold =
    state.safePoint.type === "absolute"
      ? state.safePoint.value
      : totalBalance * (state.safePoint.value / 100)

  function handleTypeChange(type: "absolute" | "percentage") {
    const value = parseFloat(inputValue) || 0
    dispatch({ type: "SET_SAFE_POINT", payload: { type, value } })
  }

  function handleValueBlur() {
    const value = parseFloat(inputValue)
    if (!isNaN(value) && value >= 0) {
      dispatch({
        type: "SET_SAFE_POINT",
        payload: { type: state.safePoint.type, value },
      })
    }
  }

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        Safe Point
      </h3>

      <Tabs
        value={state.safePoint.type}
        onValueChange={(v) => handleTypeChange(v as "absolute" | "percentage")}
      >
        <TabsList
          className="h-7 w-full"
          style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}
        >
          <TabsTrigger value="absolute" className="flex-1 text-xs h-5">
            Amount
          </TabsTrigger>
          <TabsTrigger value="percentage" className="flex-1 text-xs h-5">
            Percent
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-1.5">
        <Label className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {state.safePoint.type === "absolute"
            ? `Floor amount (${state.baseCurrency})`
            : "Floor percentage (%)"}
        </Label>
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleValueBlur}
          min="0"
          max={state.safePoint.type === "percentage" ? "100" : undefined}
          step={state.safePoint.type === "percentage" ? "1" : "0.01"}
          className="h-8 text-sm"
          style={{
            background: "var(--bg-base)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
          }}
        />
      </div>

      {totalBalance > 0 && (
        <p className="text-xs" style={{ color: "var(--safe)" }}>
          Stop at ≈ {formatCurrency(threshold, state.baseCurrency)}
        </p>
      )}
    </div>
  )
}
