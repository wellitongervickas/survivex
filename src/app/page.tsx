"use client"

import { AppProvider } from "@/context/AppContext"
import { VaultGate } from "@/components/auth/VaultGate"
import { Shell } from "@/components/layout/Shell"

export default function Page() {
  return (
    <AppProvider>
      <VaultGate>
        <Shell />
      </VaultGate>
    </AppProvider>
  )
}
