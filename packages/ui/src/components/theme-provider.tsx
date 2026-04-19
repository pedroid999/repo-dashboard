"use client"

import type { ReactNode } from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

export interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

export { useTheme }
