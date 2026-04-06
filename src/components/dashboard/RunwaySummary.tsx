"use client"

import { useSimulation } from "@/hooks/useSimulation"
import { useAppState } from "@/hooks/useAppState"
import { useCountUp } from "@/hooks/useCountUp"
import { formatCurrency, toBaseAmount } from "@/lib/utils"

function AnimatedBalance({ amount, currency }: { amount: number; currency: string }) {
  const displayed = useCountUp(amount)
  return <>{formatCurrency(displayed, currency)}</>
}

export function RunwaySummary() {
  const { snapshots, safeThreshold, decisionSnapshot } = useSimulation()
  const { state } = useAppState()

  const totalBalance = state.balances.reduce(
    (sum, b) => sum + toBaseAmount(b.amount, b.currency, state.exchangeRates, state.baseCurrency),
    0,
  )

  const monthsSafe = snapshots.filter((s) => s.isSafe).length

  const safeColor =
    monthsSafe > 6 ? "var(--safe)" : monthsSafe > 2 ? "var(--warning)" : "var(--danger)"

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance */}
      <div
        className="rounded-xl p-5 space-y-2"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Total Balance
        </p>
        <p className="text-xl md:text-2xl font-bold font-mono-num leading-none truncate" style={{ color: "var(--accent)" }}>
          <AnimatedBalance amount={totalBalance} currency={state.baseCurrency} />
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {state.baseCurrency} · {state.balances.length} account{state.balances.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Months Safe */}
      <div
        className="rounded-xl p-5 space-y-2"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Months Safe
        </p>
        <p className="text-2xl font-bold font-mono-num leading-none" style={{ color: safeColor }}>
          {monthsSafe}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          of {state.projectionMonths} projected
        </p>
      </div>

      {/* Decision Month */}
      <div
        className="rounded-xl p-5 space-y-2"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Decision Month
        </p>
        <p
          className="text-xl font-bold leading-none"
          style={{ color: decisionSnapshot ? "var(--accent)" : "var(--text-muted)" }}
        >
          {decisionSnapshot?.label ?? "—"}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {decisionSnapshot ? "Last safe month to act" : "No threshold crossed"}
        </p>
      </div>

      {/* Safe Point Floor */}
      <div
        className="rounded-xl p-5 space-y-2"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Safe Point Floor
        </p>
        <p className="text-xl md:text-2xl font-bold font-mono-num leading-none truncate" style={{ color: "var(--safe)" }}>
          <AnimatedBalance amount={safeThreshold} currency={state.baseCurrency} />
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {state.safePoint.type === "percentage"
            ? `${state.safePoint.value}% of initial`
            : "absolute floor"}
        </p>
      </div>
    </div>
  )
}
