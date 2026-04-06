"use client"

import { useSimulation } from "@/hooks/useSimulation"
import { useAppState } from "@/hooks/useAppState"
import { useCountUp } from "@/hooks/useCountUp"
import { formatCurrency } from "@/lib/utils"
import { toBaseAmount } from "@/lib/utils"

function StatCard({
  label,
  value,
  valueStyle,
  subtext,
}: {
  label: string
  value: string
  valueStyle?: React.CSSProperties
  subtext?: string
}) {
  return (
    <div
      className="rounded-lg p-4 space-y-1"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <p
        className="text-2xl font-bold font-mono-num leading-none"
        style={{ color: "var(--text-primary)", ...valueStyle }}
      >
        {value}
      </p>
      {subtext && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {subtext}
        </p>
      )}
    </div>
  )
}

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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        className="rounded-lg p-4 space-y-1"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Total Balance
        </p>
        <p className="text-2xl font-bold font-mono-num leading-none" style={{ color: "var(--accent)" }}>
          <AnimatedBalance amount={totalBalance} currency={state.baseCurrency} />
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {state.baseCurrency}
        </p>
      </div>

      <StatCard
        label="Months Safe"
        value={String(monthsSafe)}
        valueStyle={{ color: monthsSafe > 6 ? "var(--safe)" : monthsSafe > 2 ? "var(--warning)" : "var(--danger)" }}
        subtext={`of ${state.projectionMonths} projected`}
      />

      <StatCard
        label="Decision Month"
        value={decisionSnapshot?.label ?? "—"}
        valueStyle={{ color: "var(--accent)", fontSize: "1rem" }}
        subtext={decisionSnapshot ? "Last safe month to act" : "No threshold crossed"}
      />

      <div
        className="rounded-lg p-4 space-y-1"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Safe Point Floor
        </p>
        <p className="text-2xl font-bold font-mono-num leading-none" style={{ color: "var(--safe)" }}>
          <AnimatedBalance amount={safeThreshold} currency={state.baseCurrency} />
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {state.safePoint.type === "percentage"
            ? `${state.safePoint.value}% of initial balance`
            : "absolute floor"}
        </p>
      </div>
    </div>
  )
}
