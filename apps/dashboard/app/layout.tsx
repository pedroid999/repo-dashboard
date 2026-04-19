import "@workspace/ui/globals.css"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { hand, mono, display } from "@workspace/ui/fonts"
import { cn } from "@workspace/ui/lib/utils"

export const metadata = {
  title: "Tech Lead Dashboard",
  description:
    "Repo dashboard for tech leads — Kanagawa-themed monorepo skeleton.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        hand.variable,
        mono.variable,
        display.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
