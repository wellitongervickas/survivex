"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/hooks/useAppState"
import { fetchRates, toBaseRate } from "@/lib/frankfurter"

export function ExchangeRatesPanel() {
  const { state, dispatch } = useAppState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

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
    dispatch({ type: "UPSERT_EXCHANGE_RATE", payload: { from, to: state.baseCurrency, rate } })
  }

  async function handleRefresh() {
    setLoading(true)
    setError("")
    try {
      const rates = await fetchRates(state.baseCurrency)
      for (const currency of currencies) {
        const rate = toBaseRate(currency, state.baseCurrency, rates)
        dispatch({ type: "UPSERT_EXCHANGE_RATE", payload: { from: currency, to: state.baseCurrency, rate } })
      }
      setLastUpdated(new Date().toLocaleTimeString())
    } catch {
      setError("Could not fetch rates. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Exchange Rates
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {lastUpdated ? `Updated ${lastUpdated}` : "1 unit → " + state.baseCurrency}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRefresh}
          disabled={loading}
          className="h-7 px-2 text-xs gap-1.5 shrink-0"
          style={{ color: loading ? "var(--text-muted)" : "var(--accent)" }}
          title="Fetch live rates from Frankfurter (ECB data)"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Fetching…" : "Live rates"}
        </Button>
      </div>

      {error && (
        <p className="text-xs" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <div className="space-y-3">
        {currencies.map((currency) => (
          <div key={currency} className="flex items-center gap-3">
            <span
              className="text-sm w-10 shrink-0 font-mono-num font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {currency}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>→</span>
            <Input
              key={`${currency}-${getRate(currency)}`}
              type="number"
              defaultValue={getRate(currency)}
              onBlur={(e) => handleRateChange(currency, e.target.value)}
              min="0.000001"
              step="0.0001"
              className="h-8 text-sm flex-1"
              style={{
                background: "var(--bg-base)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            />
            <span className="text-xs shrink-0 w-8" style={{ color: "var(--text-muted)" }}>
              {state.baseCurrency}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Via{" "}
        <span style={{ color: "var(--accent)" }}>open.er-api.com</span>
        {" "}· free, no key · editable manually
      </p>
    </div>
  )
}
