import { describe, it, expect, vi } from "vitest"

vi.mock("next/font/google", () => {
  const factory = () => ({ variable: "--font-mock", className: "font-mock" })
  return {
    Space_Grotesk: vi.fn(factory),
    JetBrains_Mono: vi.fn(factory),
    Orbitron: vi.fn(factory),
  }
})

import * as GoogleFonts from "next/font/google"
import { hand, mono, display } from "./fonts"

describe("@workspace/ui/fonts", () => {
  it("exports hand, mono, display with variable tokens", () => {
    expect(hand).toHaveProperty("variable")
    expect(mono).toHaveProperty("variable")
    expect(display).toHaveProperty("variable")
  })

  it("invokes Space_Grotesk / JetBrains_Mono / Orbitron with display:'swap'", () => {
    expect(GoogleFonts.Space_Grotesk).toHaveBeenCalledWith(
      expect.objectContaining({
        subsets: ["latin"],
        variable: "--font-sans",
        display: "swap",
      })
    )
    expect(GoogleFonts.JetBrains_Mono).toHaveBeenCalledWith(
      expect.objectContaining({
        subsets: ["latin"],
        variable: "--font-mono",
        display: "swap",
      })
    )
    expect(GoogleFonts.Orbitron).toHaveBeenCalledWith(
      expect.objectContaining({
        subsets: ["latin"],
        variable: "--font-display",
        display: "swap",
      })
    )
  })
})
