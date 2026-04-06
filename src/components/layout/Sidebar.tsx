"use client"

import { BalancesPanel } from "@/components/panels/BalancesPanel"
import { BillsPanel } from "@/components/panels/BillsPanel"
import { IncomesPanel } from "@/components/panels/IncomesPanel"
import { SafePointPanel } from "@/components/panels/SafePointPanel"
import { ExchangeRatesPanel } from "@/components/panels/ExchangeRatesPanel"

export function Sidebar() {
  return (
    <aside
      className="flex flex-col border-r h-full overflow-hidden w-full"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3 pb-8">
          <div className="panel-slide-in">
            <BalancesPanel />
          </div>
          <div className="panel-slide-in" style={{ animationDelay: "40ms" }}>
            <BillsPanel />
          </div>
          <div className="panel-slide-in" style={{ animationDelay: "80ms" }}>
            <IncomesPanel />
          </div>
          <div className="panel-slide-in" style={{ animationDelay: "120ms" }}>
            <SafePointPanel />
          </div>
          <div className="panel-slide-in" style={{ animationDelay: "160ms" }}>
            <ExchangeRatesPanel />
          </div>
        </div>
      </div>
    </aside>
  )
}
