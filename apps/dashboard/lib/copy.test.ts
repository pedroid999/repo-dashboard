import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { copy } from "./copy"

describe("copy module (AS-11, ADR-10)", () => {
  it("has no i18n runtime dependency in apps/dashboard/package.json", () => {
    const pkgPath = resolve(__dirname, "../package.json")
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const forbidden = [
      "next-intl",
      "react-intl",
      "i18next",
      "react-i18next",
      "@formatjs/intl",
      "lingui",
      "next-translate",
    ]
    const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    for (const name of forbidden) {
      expect(all[name]).toBeUndefined()
    }
  })

  it("exposes the five variation headings verbatim", () => {
    expect(copy.variations.v1.heading).toBe("Repos & pipelines")
    expect(copy.variations.v2.heading).toBe("Matriz repos × tiempo")
    expect(copy.variations.v3.heading).toBe("Tablero por estado")
    expect(copy.variations.v4.heading).toBe("Todas las pipelines")
    expect(copy.variations.v5.heading).toBe("Timeline de pipelines")
  })

  it("exposes sidebar section labels in Spanish", () => {
    expect(copy.sidebar.sections.project).toBe("Proyecto")
    expect(copy.sidebar.sections.view).toBe("Vista")
    expect(copy.sidebar.sections.team).toBe("Equipo")
  })

  it("exposes topbar copy including English-in-wireframe strings verbatim", () => {
    expect(copy.topbar.newPipeline).toBe("New pipeline")
    expect(copy.topbar.searchPlaceholder).toBe("Buscar repo, MR, autor, rama…")
  })

  it("exposes breadcrumb path with platform-core and Pipelines", () => {
    expect(copy.topbar.breadcrumb).toEqual([
      "Workspace",
      "sngular",
      "platform-core",
      "Pipelines",
    ])
  })

  it("exposes attention-bar labels verbatim from the wireframe", () => {
    expect(copy.attention.heading).toBe("Necesita atención")
    expect(copy.attention.pipelinesRed).toBe("pipelines rojas")
    expect(copy.attention.running).toBe("corriendo")
    expect(copy.attention.blockedMrs).toBe("MRs bloqueadas")
    expect(copy.attention.staleMrs).toBe("MRs viejas (>5d)")
  })

  it("exposes tweaks-panel labels in Spanish (no groupBy per ADR-12)", () => {
    expect(copy.tweaks.heading).toBe("Tweaks")
    expect(copy.tweaks.theme).toBe("Theme")
    expect(copy.tweaks.density).toBe("Densidad")
    expect(copy.tweaks.showMRs).toBe("Mostrar MRs")
    expect(copy.tweaks.cardSize).toBe("Tamaño tarjeta")
    expect(copy.tweaks.paperGrid).toBe("Grid papel")
    expect((copy.tweaks as Record<string, string>).groupBy).toBeUndefined()
  })
})
