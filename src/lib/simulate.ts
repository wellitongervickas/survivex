import type { AppState, MonthlySnapshot } from "@/types"
import { toBaseAmount, getMonthIsoDate, formatMonthLabel } from "@/lib/utils"

const WEEKLY_TO_MONTHLY = 52 / 12

function isSameYearMonth(isoDate1: string, isoDate2: string): boolean {
  return isoDate1.slice(0, 7) === isoDate2.slice(0, 7)
}

export function simulate(state: AppState): MonthlySnapshot[] {
  const { baseCurrency, balances, bills, incomes, safePoint, exchangeRates, projectionMonths } =
    state

  // Starting balance in base currency
  const totalStartBalance = balances.reduce(
    (sum, b) => sum + toBaseAmount(b.amount, b.currency, exchangeRates, baseCurrency),
    0,
  )

  // Safe threshold (fixed at simulation start)
  const safeThreshold =
    safePoint.type === "absolute"
      ? safePoint.value
      : totalStartBalance * (safePoint.value / 100)

  const now = new Date()
  const snapshots: MonthlySnapshot[] = []
  let currentBalance = totalStartBalance

  for (let month = 0; month < projectionMonths; month++) {
    const isoDate = getMonthIsoDate(now, month)
    const label = formatMonthLabel(isoDate)

    // Calculate expenses
    let totalExpenses = 0
    for (const bill of bills) {
      if (!bill.active) continue
      const amount = toBaseAmount(
        bill.adjustedAmount ?? bill.amount,
        bill.currency,
        exchangeRates,
        baseCurrency,
      )
      switch (bill.frequency) {
        case "monthly":
          totalExpenses += amount
          break
        case "weekly":
          totalExpenses += amount * WEEKLY_TO_MONTHLY
          break
        case "yearly":
          // Apply at months 0, 12, 24...
          if (month % 12 === 0) totalExpenses += amount
          break
        case "one-time":
          if (bill.date && isSameYearMonth(bill.date, isoDate)) totalExpenses += amount
          break
      }
    }

    // Calculate income
    let totalIncome = 0
    for (const income of incomes) {
      const amount = toBaseAmount(income.amount, income.currency, exchangeRates, baseCurrency)
      switch (income.frequency) {
        case "monthly":
          totalIncome += amount
          break
        case "one-time":
          if (income.date && isSameYearMonth(income.date, isoDate)) totalIncome += amount
          break
      }
    }

    currentBalance = currentBalance - totalExpenses + totalIncome

    snapshots.push({
      month,
      label,
      isoDate,
      balance: currentBalance,
      totalExpenses,
      totalIncome,
      isSafe: currentBalance >= safeThreshold,
      isDecisionMonth: false,
      isDepleted: currentBalance <= 0,
    })
  }

  // Post-process: mark decision month (last safe month before going unsafe)
  let lastSafeIdx = -1
  for (let i = 0; i < snapshots.length; i++) {
    if (snapshots[i].isSafe) {
      lastSafeIdx = i
    }
  }
  // Decision month = last safe snapshot if next one is unsafe (or it's the last one)
  if (lastSafeIdx >= 0) {
    const next = snapshots[lastSafeIdx + 1]
    if (!next || !next.isSafe) {
      snapshots[lastSafeIdx].isDecisionMonth = true
    }
  }

  return snapshots
}

export function computeSafeThreshold(state: AppState): number {
  const { baseCurrency, balances, safePoint, exchangeRates } = state
  const totalStartBalance = balances.reduce(
    (sum, b) => sum + toBaseAmount(b.amount, b.currency, exchangeRates, baseCurrency),
    0,
  )
  return safePoint.type === "absolute"
    ? safePoint.value
    : totalStartBalance * (safePoint.value / 100)
}
