"use client"

import { useEffect, useState } from "react"
import { IconButton } from "@workspace/ui"
import {
  WorkspaceIcon,
  GroupIcon,
  SubgroupIcon,
  PipeIcon,
  ChevIcon,
  SearchIcon,
  RefreshIcon,
  FilterIcon,
  SunIcon,
  MoonIcon,
} from "@workspace/ui/icons"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { copy } from "../../lib/copy"

const breadcrumbIcons = [WorkspaceIcon, GroupIcon, SubgroupIcon, PipeIcon]
const breadcrumbColors = [
  "var(--ink-3)",
  "var(--link)",
  "var(--link)",
  "var(--purple)",
]

export function Topbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const [tick, setTick] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setTick((s) => (s + 1) % 30)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = 30 - tick

  const handleToggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const themeIcon = !mounted ? (
    <span
      aria-hidden="true"
      style={{ width: 14, height: 14, display: "inline-block" }}
    />
  ) : resolvedTheme === "dark" ? (
    <SunIcon />
  ) : (
    <MoonIcon />
  )

  return (
    <div className="topbar">
      <div className="crumb" data-testid="breadcrumb">
        {copy.topbar.breadcrumb.map((segment, idx) => {
          const Icon = breadcrumbIcons[idx] ?? PipeIcon
          const color = breadcrumbColors[idx] ?? "var(--ink-3)"
          const isLast = idx === copy.topbar.breadcrumb.length - 1
          return (
            <span
              key={segment}
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  display: "inline-grid",
                  placeItems: "center",
                  color,
                }}
                aria-hidden="true"
              >
                <Icon />
              </span>
              {isLast || idx === 2 ? <b>{segment}</b> : segment}
              {!isLast ? (
                <span
                  aria-hidden="true"
                  style={{
                    color: "var(--ink-3)",
                    display: "inline-flex",
                    alignItems: "center",
                    width: 10,
                    height: 10,
                    marginLeft: 6,
                    marginRight: 6,
                  }}
                >
                  <ChevIcon />
                </span>
              ) : null}
            </span>
          )
        })}
      </div>

      <div
        className="search rough-sm"
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <span aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          type="search"
          readOnly
          placeholder={copy.topbar.searchPlaceholder}
          aria-label={copy.topbar.searchPlaceholder}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "inherit",
            font: "inherit",
            flex: 1,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginLeft: "auto",
        }}
      >
        <span
          data-testid="refresh-indicator"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--ink-2)",
          }}
        >
          <span className="dot-live" aria-hidden="true" /> {copy.topbar.liveLabel} ·{" "}
          {remaining}s
        </span>
        <IconButton icon={<RefreshIcon />} label={copy.topbar.iconTitles.refresh} />
        <IconButton icon={<FilterIcon />} label={copy.topbar.iconTitles.filter} />
        <IconButton
          icon={themeIcon}
          label={copy.topbar.iconTitles.theme}
          disabled={!mounted}
          onClick={mounted ? handleToggleTheme : undefined}
        />
        <button
          type="button"
          className="btn rough-sm"
          aria-disabled="true"
          onClick={(e) => e.preventDefault()}
        >
          {copy.topbar.newPipeline}
        </button>
      </div>
    </div>
  )
}
