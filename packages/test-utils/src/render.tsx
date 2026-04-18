import React from 'react'
import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}

export function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return rtlRender(ui, { wrapper: AllProviders, ...options })
}
