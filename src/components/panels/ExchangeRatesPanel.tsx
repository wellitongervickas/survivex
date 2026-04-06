"use client"

import { Input } from "@/components/ui/input"
import { useAppState } from "@/hooks/useAppState"

export function ExchangeRatesPanel() {
  const { state, dispatch } = useAppState()

  // Collect all unique non-base currencies used across balances, bills, incomes
  const usedCurrencies = new Set<string>()
  state.balances.forEach((b) => { if (b.currency !== state.baseCurrency) usedCurrencies.add(b.currency) })
  state.bills.forEach((b) => { if (b.currency !== state.baseCurrency) usedCurrencies.add(b.currency) })
  state.incomes.forEach((i) => { if (i.currency !== state.baseCurrency) usedCurrencies.add(i.currency) })

  const currencies = Array.from(usedCurrencies)

  if (currencies.length === 0) return null

  function getRate(from: string): string {
    const rate = state.exchangeRates.find((r) => r.from === from && r.to === state.baseCurrency)
    return rate ? String(rate.rate) : "1"
  }

  function handleRateChange(from: string, value: string) {
    const rate = parseFloat(value)
    if (isNaN(rate) || rate <= 0) return
    dispatch({
      type: "UPSERT_EXCHANGE_RATE",
      payload: { from, to: state.baseCurrency, rate },
    })
  }

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        Exchange Rates
      </h3>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        1 unit → {state.baseCurrency}
      </p>

      <div className="space-y-2">
        {currencies.map((currency) => (
          <div key={currency} className="flex items-center gap-2">
            <span
              className="text-sm w-12 shrink-0 font-mono-num"
              style={{ color: "var(--text-secondary)" }}
            >
              {currency}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              →
            </span>
            <Input
              type="number"
              defaultValue={getRate(currency)}
              onBlur={(e) => handleRateChange(currency, e.target.value)}
              min="0.000001"
              step="0.0001"
              className="h-7 text-xs flex-1"
              style={{
                background: "var(--bg-base)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            />
            <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
              {state.baseCurrency}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
