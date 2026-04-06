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
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-[380px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <RunwaySummary />

            {/* Projection range selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
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
                      className="text-xs h-6 px-3"
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

            {/* Mobile sidebar panels */}
            <div className="md:hidden space-y-2 pb-8">
              <Sidebar />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
