"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { useSimulation } from "@/hooks/useSimulation"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import type { MonthlySnapshot } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const snapshot = payload[0]?.payload as MonthlySnapshot
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
      <p style={{ color: snapshot.isSafe ? "var(--safe)" : "var(--danger)" }}>
        Balance: {formatCurrency(snapshot.balance, "EUR")}
      </p>
      <p style={{ color: "var(--text-muted)" }}>
        Expenses: {formatCurrency(snapshot.totalExpenses, "EUR")}
      </p>
      <p style={{ color: "var(--safe)" }}>
        Income: +{formatCurrency(snapshot.totalIncome, "EUR")}
      </p>
    </div>
  )
}

export function RunwayChart() {
  const { snapshots, safeThreshold, decisionSnapshot } = useSimulation()
  const { state } = useAppState()

  if (snapshots.length === 0) {
    return (
      <div
        className="rounded-lg p-8 flex items-center justify-center"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", minHeight: 320 }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Add balances and bills to see your runway.
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Balance Runway
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={snapshots} margin={{ top: 28, right: 16, bottom: 0, left: 0 }}>
          <defs key="gradient-defs">
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            opacity={0.4}
          />

          <XAxis
            dataKey="label"
            tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(v)
            }
            width={60}
          />

          <Tooltip content={<CustomTooltip />} />

          {safeThreshold > 0 && (
            <ReferenceLine
              y={safeThreshold}
              stroke="var(--safe)"
              strokeDasharray="6 3"
              strokeOpacity={0.8}
              label={{
                value: "Safe Point",
                fill: "var(--safe)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
            />
          )}

          {decisionSnapshot && (
            <ReferenceLine
              x={decisionSnapshot.label}
              stroke="var(--accent)"
              strokeDasharray="4 2"
              label={{
                value: "Act by here",
                fill: "var(--accent)",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                position: "insideTopRight",
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#balanceGradient)"
            animationDuration={800}
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent)", stroke: "var(--bg-base)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-xs mt-2 text-right" style={{ color: "var(--text-muted)" }}>
        Base currency: {state.baseCurrency}
      </p>
    </div>
  )
}
