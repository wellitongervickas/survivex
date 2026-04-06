"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useSimulation } from "@/hooks/useSimulation"
import { useAppState } from "@/hooks/useAppState"
import { formatCurrency } from "@/lib/utils"
import type { MonthlySnapshot } from "@/types"
import { cn } from "@/lib/utils"

function rowBorderColor(snapshot: MonthlySnapshot): string {
  if (snapshot.isDepleted) return "var(--danger)"
  if (!snapshot.isSafe) return "var(--warning)"
  return "var(--safe)"
}

function StatusBadge({ snapshot }: { snapshot: MonthlySnapshot }) {
  if (snapshot.isDecisionMonth) {
    return (
      <span
        className="text-xs px-1.5 py-0.5 rounded font-mono-num"
        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
      >
        ACT
      </span>
    )
  }
  if (snapshot.isDepleted) {
    return <span className="text-xs" style={{ color: "var(--danger)" }}>Depleted</span>
  }
  if (!snapshot.isSafe) {
    return <span className="text-xs" style={{ color: "var(--warning)" }}>Unsafe</span>
  }
  return <span className="text-xs" style={{ color: "var(--safe)" }}>Safe</span>
}

export function MonthlyTimeline() {
  const { snapshots } = useSimulation()
  const { state } = useAppState()

  if (snapshots.length === 0) return null

  return (
    <div
      className="rounded-lg"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Month-by-Month Timeline
        </h3>
      </div>

      <ScrollArea className="h-80 overflow-x-auto">
        <table className="w-full min-w-[280px] text-xs">
          <thead>
            <tr
              className="border-b sticky top-0"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <th className="text-left p-3 font-normal">Month</th>
              <th className="text-right p-3 font-normal font-mono-num">Balance</th>
              <th className="text-right p-3 font-normal font-mono-num hidden sm:table-cell">Income</th>
              <th className="text-right p-3 font-normal font-mono-num hidden sm:table-cell">Expenses</th>
              <th className="text-right p-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot) => (
              <tr
                key={snapshot.month}
                className={cn("border-b border-l-2 transition-colors")}
                style={{
                  borderBottomColor: "var(--border)",
                  borderLeftColor: rowBorderColor(snapshot),
                  background: snapshot.isDecisionMonth
                    ? "color-mix(in srgb, var(--accent-dim) 30%, transparent)"
                    : "transparent",
                }}
              >
                <td className="p-3" style={{ color: "var(--text-secondary)" }}>
                  {snapshot.label}
                </td>
                <td
                  className="p-3 text-right font-mono-num"
                  style={{
                    color: snapshot.isSafe
                      ? "var(--text-primary)"
                      : snapshot.isDepleted
                      ? "var(--danger)"
                      : "var(--warning)",
                  }}
                >
                  {formatCurrency(snapshot.balance, state.baseCurrency)}
                </td>
                <td
                  className="p-3 text-right font-mono-num hidden sm:table-cell"
                  style={{ color: "var(--safe)" }}
                >
                  {snapshot.totalIncome > 0 ? `+${formatCurrency(snapshot.totalIncome, state.baseCurrency)}` : "—"}
                </td>
                <td
                  className="p-3 text-right font-mono-num hidden sm:table-cell"
                  style={{ color: "var(--danger)" }}
                >
                  -{formatCurrency(snapshot.totalExpenses, state.baseCurrency)}
                </td>
                <td className="p-3 text-right">
                  <StatusBadge snapshot={snapshot} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}
