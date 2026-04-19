"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { useTweaks } from "../../hooks/use-tweaks"
import { copy } from "../../lib/copy"

export function TweaksPanel() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { tweaks, setDensity, setPaperGrid, setRough } = useTweaks()

  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.classList.toggle("paper-on", tweaks.paperGrid)
  }, [tweaks.paperGrid])

  const labelFor = (on: boolean) => (on ? copy.tweaks.toggleOn : copy.tweaks.toggleOff)

  return (
    <>
      <div className="note-stamp">
        <button
          type="button"
          className="btn rough-sm"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--ok)",
            }}
          />
          {copy.tweaks.heading} {open ? "▾" : "▸"}
        </button>
      </div>

      {open ? (
        <div
          className={`tweaks-panel rough open`}
          role="group"
          aria-label={copy.tweaks.heading}
        >
          <h3>{copy.tweaks.heading}</h3>

          <div className="tweaks-row">
            <span id="tweak-theme">{copy.tweaks.theme}</span>
            <button
              type="button"
              aria-label={copy.tweaks.theme}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme ?? "dark"}
            </button>
          </div>

          <div className="tweaks-row">
            <span id="tweak-density">{copy.tweaks.density}</span>
            <button
              type="button"
              aria-label={copy.tweaks.density}
              onClick={() =>
                setDensity(tweaks.density === "cozy" ? "compact" : "cozy")
              }
            >
              {tweaks.density}
            </button>
          </div>

          <div className="tweaks-row">
            <span id="tweak-paper">{copy.tweaks.paperGrid}</span>
            <button
              type="button"
              aria-label={copy.tweaks.paperGrid}
              onClick={() => setPaperGrid(!tweaks.paperGrid)}
            >
              {labelFor(tweaks.paperGrid)}
            </button>
          </div>

          <div className="tweaks-row">
            <span id="tweak-rough">Rough borders</span>
            <button
              type="button"
              aria-label="Rough borders"
              onClick={() => setRough(!tweaks.rough)}
            >
              {labelFor(tweaks.rough)}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
