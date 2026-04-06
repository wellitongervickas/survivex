"use client"

import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { RunwaySummary } from "@/components/dashboard/RunwaySummary"
import { MonthlyTimeline } from "@/components/dashboard/MonthlyTimeline"
import { RunwayChart } from "@/components/charts/RunwayChart"
import { MonthlyBreakdownChart } from "@/components/charts/MonthlyBreakdownChart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppState } from "@/hooks/useAppState"

export function Shell() {
  const { dispatch, state } = useAppState()

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--bg-base)" }}>
      <Header />

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar — fixed width, full height, scrolls internally */}
        <div
          className="hidden md:block flex-shrink-0"
          style={{ width: 380, borderRight: "1px solid var(--border)" }}
        >
          <Sidebar />
        </div>

        {/* Main content — scrolls independently */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-8 max-w-5xl">
            <RunwaySummary />

            {/* Projection range selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                Projection
              </span>
              <Tabs
                value={String(state.projectionMonths)}
                onValueChange={(v) =>
                  dispatch({ type: "SET_PROJECTION_MONTHS", payload: Number(v) })
                }
              >
                <TabsList
                  className="h-8"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                >
                  {[12, 24, 36].map((m) => (
                    <TabsTrigger
                      key={m}
                      value={String(m)}
                      className="text-xs h-6 px-4"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {m}mo
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <RunwayChart />
            <MonthlyBreakdownChart />
            <MonthlyTimeline />

            {/* Mobile: panels below dashboard */}
            <div className="md:hidden space-y-3 pb-10">
              <Sidebar />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
