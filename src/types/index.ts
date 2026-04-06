export type CurrencyCode = string

export type Balance = {
  id: string
  label: string
  amount: number
  currency: CurrencyCode
  createdAt: string
}

export type BillFrequency = "monthly" | "weekly" | "yearly" | "one-time"

export type Bill = {
  id: string
  label: string
  amount: number
  adjustedAmount?: number
  currency: CurrencyCode
  frequency: BillFrequency
  date?: string
  active: boolean
}

export type IncomeFrequency = "monthly" | "one-time"

export type Income = {
  id: string
  label: string
  amount: number
  currency: CurrencyCode
  frequency: IncomeFrequency
  date?: string
}

export type SafePoint = {
  type: "absolute" | "percentage"
  value: number
}

export type ExchangeRate = {
  from: CurrencyCode
  to: CurrencyCode
  rate: number
}

export type AppState = {
  baseCurrency: CurrencyCode
  balances: Balance[]
  bills: Bill[]
  incomes: Income[]
  safePoint: SafePoint
  exchangeRates: ExchangeRate[]
  projectionMonths: number
}

export type MonthlySnapshot = {
  month: number
  label: string
  isoDate: string
  balance: number
  totalExpenses: number
  totalIncome: number
  isSafe: boolean
  isDecisionMonth: boolean
  isDepleted: boolean
}

export type EncryptedBlob = {
  salt: Uint8Array
  iv: Uint8Array
  data: ArrayBuffer
}
