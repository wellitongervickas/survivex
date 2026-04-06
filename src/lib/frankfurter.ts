/**
 * Exchange rate fetching via open.er-api.com — free, no auth, no rate limits.
 * Falls back to api.frankfurter.dev/v2 if primary fails.
 *
 * Response shape (primary): { base_code: "EUR", rates: { USD: 1.08, BRL: 5.42, ... } }
 */

type ErApiResponse = {
  result: string
  base_code: string
  rates: Record<string, number>
}

type FrankfurterV2Item = {
  date: string
  base: string
  quote: string
  rate: number
}

async function fetchFromErApi(base: string): Promise<Record<string, number>> {
  const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`)
  if (!res.ok) throw new Error(`open.er-api.com error: ${res.status}`)
  const data: ErApiResponse = await res.json()
  if (data.result !== "success") throw new Error("open.er-api.com returned failure")
  return data.rates
}

async function fetchFromFrankfurter(base: string): Promise<Record<string, number>> {
  const res = await fetch(`https://api.frankfurter.dev/v2/rates?base=${encodeURIComponent(base)}`)
  if (!res.ok) throw new Error(`Frankfurter error: ${res.status}`)
  // v2 returns an array: [{ date, base, quote, rate }]
  const items: FrankfurterV2Item[] = await res.json()
  const rates: Record<string, number> = { [base]: 1 }
  for (const item of items) {
    rates[item.quote] = item.rate
  }
  return rates
}

/**
 * Fetch live rates. Returns: { "USD": 1.089, "BRL": 5.42, ... }
 * where each value is "how many units of that currency per 1 unit of base".
 * Tries open.er-api.com first, falls back to Frankfurter.
 */
export async function fetchRates(base: string): Promise<Record<string, number>> {
  try {
    return await fetchFromErApi(base)
  } catch {
    return await fetchFromFrankfurter(base)
  }
}

/**
 * Convert Frankfurter-style rates to the app's internal rate format.
 * App stores: "1 from-unit = X base-units"
 * API gives:  "1 base-unit = X from-units" (i.e. rates[from])
 * So: internalRate = 1 / rates[from]
 */
export function toBaseRate(from: string, base: string, rates: Record<string, number>): number {
  if (from === base) return 1
  const raw = rates[from]
  if (!raw || raw === 0) return 1
  return 1 / raw
}
