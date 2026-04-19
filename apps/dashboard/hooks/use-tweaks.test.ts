import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, renderHook } from "@testing-library/react"

const routerPush = vi.fn()

let searchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush, replace: vi.fn() }),
  useSearchParams: () => searchParams,
  usePathname: () => "/",
}))

function resetStorage(initial?: Record<string, string>) {
  localStorage.clear()
  if (initial) {
    for (const [k, v] of Object.entries(initial)) {
      localStorage.setItem(k, v)
    }
  }
}

beforeEach(() => {
  routerPush.mockClear()
  searchParams = new URLSearchParams()
  resetStorage()
})

describe("useTweaks (AS-1 / AS-2)", () => {
  it("URL ?v=v3 beats stored variation v2 on cold mount", async () => {
    searchParams = new URLSearchParams("v=v3")
    resetStorage({ tweaks: JSON.stringify({ variation: "v2" }) })

    const { useTweaks } = await import("./use-tweaks")
    const { result } = renderHook(() => useTweaks())
    expect(result.current.tweaks.variation).toBe("v3")
    expect(JSON.parse(localStorage.getItem("tweaks") ?? "{}").variation).toBe("v3")
  })

  it("invalid ?v=hacker falls back to v1 and reconciles URL + localStorage", async () => {
    searchParams = new URLSearchParams("v=hacker")
    const { useTweaks } = await import("./use-tweaks")
    const { result } = renderHook(() => useTweaks())
    expect(result.current.tweaks.variation).toBe("v1")
    expect(routerPush).toHaveBeenCalledWith(expect.stringContaining("v=v1"))
    expect(JSON.parse(localStorage.getItem("tweaks") ?? "{}").variation).toBe("v1")
  })

  it("patch() writes tweak changes to localStorage without touching the URL", async () => {
    const { useTweaks } = await import("./use-tweaks")
    const { result } = renderHook(() => useTweaks())

    act(() => {
      result.current.setDensity("compact")
      result.current.setPaperGrid(true)
    })

    const stored = JSON.parse(localStorage.getItem("tweaks") ?? "{}")
    expect(stored.density).toBe("compact")
    expect(stored.paperGrid).toBe(true)
    expect(routerPush).not.toHaveBeenCalled()
  })

  it("setVariation(v4) pushes ?v=v4 to the URL and writes to localStorage", async () => {
    const { useTweaks } = await import("./use-tweaks")
    const { result } = renderHook(() => useTweaks())
    act(() => {
      result.current.setVariation("v4")
    })
    expect(routerPush).toHaveBeenCalledWith(expect.stringContaining("v=v4"))
    expect(JSON.parse(localStorage.getItem("tweaks") ?? "{}").variation).toBe("v4")
  })

  it("tolerates localStorage.getItem throwing (private window) and renders with defaults", async () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("private mode")
      })
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("private mode")
      })
    try {
      const { useTweaks } = await import("./use-tweaks")
      const { result } = renderHook(() => useTweaks())
      expect(result.current.tweaks.variation).toBe("v1")
      expect(result.current.tweaks.paperGrid).toBe(false)
      act(() => {
        result.current.setPaperGrid(true)
      })
      expect(result.current.tweaks.paperGrid).toBe(true)
    } finally {
      getItemSpy.mockRestore()
      setItemSpy.mockRestore()
    }
  })
})
