import { describe, it, expect } from "vitest"
import { parseVariation, VARIATIONS } from "./variation"

describe("parseVariation (AS-1)", () => {
  it("returns v1 for undefined", () => {
    expect(parseVariation(undefined)).toBe("v1")
  })

  it("returns v1 for empty string", () => {
    expect(parseVariation("")).toBe("v1")
  })

  it("returns v1 for invalid values", () => {
    expect(parseVariation("hacker")).toBe("v1")
    expect(parseVariation("V1")).toBe("v1")
    expect(parseVariation("v6")).toBe("v1")
  })

  it("returns itself for every valid variation", () => {
    for (const v of VARIATIONS) {
      expect(parseVariation(v)).toBe(v)
    }
  })
})
