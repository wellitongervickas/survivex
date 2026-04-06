import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ExchangeRate } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatMonthLabel(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00Z")
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
}

export function toBaseAmount(
  amount: number,
  from: string,
  rates: ExchangeRate[],
  baseCurrency: string,
): number {
  if (from === baseCurrency) return amount
  const rate = rates.find((r) => r.from === from && r.to === baseCurrency)
  if (!rate) return amount
  return amount * rate.rate
}

export function getMonthIsoDate(baseDate: Date, monthOffset: number): string {
  const d = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + monthOffset, 1))
  return d.toISOString().slice(0, 10)
}

