import { Space_Grotesk, JetBrains_Mono, Orbitron } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
})

const fontDisplay = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
})

export const metadata = {
  title: "Tech Lead Dashboard",
  description: "Repo dashboard for tech leads — Kanagawa-themed monorepo skeleton.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        fontDisplay.variable,
        "font-sans",
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
