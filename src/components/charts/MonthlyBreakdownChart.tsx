"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useSimulation } from "@/hooks/useSimulation"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import type { MonthlySnapshot } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const snap = payload[0]?.payload as MonthlySnapshot
  return (
    <div
      className="text-xs p-3 rounded space-y-1"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <p style={{ color: "var(--text-secondary)" }}>{label}</p>
      <p style={{ color: "var(--safe)" }}>
        Income: +{formatCurrency(snap.totalIncome, "EUR")}
      </p>
      <p style={{ color: "var(--danger)" }}>
        Expenses: -{formatCurrency(snap.totalExpenses, "EUR")}
      </p>
    </div>
  )
}

export function MonthlyBreakdownChart() {
  const { snapshots } = useSimulation()
  const { state } = useAppState()

  if (snapshots.length === 0) return null

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Monthly Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={snapshots} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barGap={2}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            opacity={0.4}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(v)
            }
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
          />
          <Bar dataKey="totalIncome" name="Income" fill="var(--safe)" radius={[2, 2, 0, 0]} animationDuration={600} />
          <Bar dataKey="totalExpenses" name="Expenses" fill="var(--danger)" radius={[2, 2, 0, 0]} animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs mt-2 text-right" style={{ color: "var(--text-muted)" }}>
        Base currency: {state.baseCurrency}
      </p>
    </div>
  )
}
