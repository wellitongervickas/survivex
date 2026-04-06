"use client"

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useCallback,
} from "react"
import type {
  AppState,
  Balance,
  Bill,
  Income,
  SafePoint,
  ExchangeRate,
  CurrencyCode,
} from "@/types"
import { saveWithSession } from "@/lib/crypto"
import type { SessionKey } from "@/lib/crypto"

export const DEFAULT_STATE: AppState = {
  baseCurrency: "EUR",
  balances: [],
  bills: [],
  incomes: [],
  safePoint: { type: "percentage", value: 10 },
  exchangeRates: [],
  projectionMonths: 24,
}

export type AppAction =
  | { type: "SET_STATE"; payload: AppState }
  | { type: "SET_BASE_CURRENCY"; payload: CurrencyCode }
  | { type: "ADD_BALANCE"; payload: Balance }
  | { type: "UPDATE_BALANCE"; payload: Balance }
  | { type: "DELETE_BALANCE"; payload: string }
  | { type: "ADD_BILL"; payload: Bill }
  | { type: "UPDATE_BILL"; payload: Bill }
  | { type: "DELETE_BILL"; payload: string }
  | { type: "ADD_INCOME"; payload: Income }
  | { type: "UPDATE_INCOME"; payload: Income }
  | { type: "DELETE_INCOME"; payload: string }
  | { type: "SET_SAFE_POINT"; payload: SafePoint }
  | { type: "SET_EXCHANGE_RATES"; payload: ExchangeRate[] }
  | { type: "UPSERT_EXCHANGE_RATE"; payload: ExchangeRate }
  | { type: "SET_PROJECTION_MONTHS"; payload: number }
  | { type: "UPDATE_BILL_SLIDER"; payload: { id: string; adjustedAmount: number | undefined } }
  | { type: "RESET" }

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_STATE":
      return action.payload
    case "SET_BASE_CURRENCY":
      return { ...state, baseCurrency: action.payload }
    case "ADD_BALANCE":
      return { ...state, balances: [...state.balances, action.payload] }
    case "UPDATE_BALANCE":
      return { ...state, balances: state.balances.map((b) => (b.id === action.payload.id ? action.payload : b)) }
    case "DELETE_BALANCE":
      return { ...state, balances: state.balances.filter((b) => b.id !== action.payload) }
    case "ADD_BILL":
      return { ...state, bills: [...state.bills, action.payload] }
    case "UPDATE_BILL":
      return { ...state, bills: state.bills.map((b) => (b.id === action.payload.id ? action.payload : b)) }
    case "DELETE_BILL":
      return { ...state, bills: state.bills.filter((b) => b.id !== action.payload) }
    case "ADD_INCOME":
      return { ...state, incomes: [...state.incomes, action.payload] }
    case "UPDATE_INCOME":
      return { ...state, incomes: state.incomes.map((i) => (i.id === action.payload.id ? action.payload : i)) }
    case "DELETE_INCOME":
      return { ...state, incomes: state.incomes.filter((i) => i.id !== action.payload) }
    case "SET_SAFE_POINT":
      return { ...state, safePoint: action.payload }
    case "SET_EXCHANGE_RATES":
      return { ...state, exchangeRates: action.payload }
    case "UPSERT_EXCHANGE_RATE": {
      const exists = state.exchangeRates.some(
        (r) => r.from === action.payload.from && r.to === action.payload.to,
      )
      if (exists) {
        return {
          ...state,
          exchangeRates: state.exchangeRates.map((r) =>
            r.from === action.payload.from && r.to === action.payload.to ? action.payload : r,
          ),
        }
      }
      return { ...state, exchangeRates: [...state.exchangeRates, action.payload] }
    }
    case "SET_PROJECTION_MONTHS":
      return { ...state, projectionMonths: action.payload }
    case "UPDATE_BILL_SLIDER":
      return {
        ...state,
        bills: state.bills.map((b) =>
          b.id === action.payload.id
            ? { ...b, adjustedAmount: action.payload.adjustedAmount }
            : b,
        ),
      }
    case "RESET":
      return DEFAULT_STATE
    default:
      return state
  }
}

type AppContextValue = {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  /** Called by VaultGate after unlock/create — provides the session key for auto-save. */
  setSession: (session: SessionKey | null) => void
  clearState: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)
  const sessionRef = useRef<SessionKey | null>(null)
  // Track whether state has been loaded from vault (skip auto-save on initial render)
  const readyRef = useRef(false)

  const setSession = useCallback((session: SessionKey | null) => {
    sessionRef.current = session
    if (!session) readyRef.current = false
  }, [])

  const clearState = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  // Auto-save whenever state changes, with a short debounce
  useEffect(() => {
    if (!readyRef.current) return
    const session = sessionRef.current
    if (!session) return

    const timer = setTimeout(() => {
      saveWithSession(JSON.stringify(state), session).catch(() => {
        // Silent — save will retry on next change
      })
    }, 400)

    return () => clearTimeout(timer)
  }, [state])

  // Expose a way for VaultGate to mark "ready to auto-save"
  const dispatchAndMark = useCallback(
    (action: AppAction) => {
      if (action.type === "SET_STATE") {
        readyRef.current = true
      }
      dispatch(action)
    },
    [],
  )

  return (
    <AppContext.Provider value={{ state, dispatch: dispatchAndMark, setSession, clearState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppContext must be used within AppProvider")
  return ctx
}
