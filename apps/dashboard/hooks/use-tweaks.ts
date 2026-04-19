"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parseVariation, type Variation } from "../lib/variation"

const STORAGE_KEY = "tweaks"

export type Density = "cozy" | "compact"

export interface Tweaks {
  variation: Variation
  density: Density
  paperGrid: boolean
  rough: boolean
}

const DEFAULT_TWEAKS: Tweaks = {
  variation: "v1",
  density: "cozy",
  paperGrid: false,
  rough: true,
}

function safeRead(): Partial<Tweaks> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Partial<Tweaks>
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function safeWrite(tweaks: Tweaks): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks))
  } catch {
    // noop — private mode / quota errors are non-fatal
  }
}

export interface UseTweaksResult {
  tweaks: Tweaks
  setVariation: (v: Variation) => void
  setDensity: (d: Density) => void
  setPaperGrid: (on: boolean) => void
  setRough: (on: boolean) => void
}

export function useTweaks(): UseTweaksResult {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlVariationRaw = searchParams.get("v") ?? undefined

  const initial = useMemo<Tweaks>(() => {
    const stored = safeRead()
    const base: Tweaks = { ...DEFAULT_TWEAKS, ...stored }
    const urlVariation = urlVariationRaw ? parseVariation(urlVariationRaw) : undefined
    if (urlVariation) {
      base.variation = urlVariation
    }
    return base
  }, [urlVariationRaw])

  const [tweaks, setTweaks] = useState<Tweaks>(initial)
  const didReconcileRef = useRef(false)

  useEffect(() => {
    safeWrite(tweaks)
  }, [tweaks])

  useEffect(() => {
    if (didReconcileRef.current) return
    didReconcileRef.current = true
    if (urlVariationRaw !== undefined) {
      const parsed = parseVariation(urlVariationRaw)
      if (parsed !== urlVariationRaw) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("v", parsed)
        router.push(`${pathname}?${params.toString()}`)
      }
    }
  }, [urlVariationRaw, pathname, router, searchParams])

  const pushVariation = useCallback(
    (v: Variation) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("v", v)
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const setVariation = useCallback(
    (v: Variation) => {
      setTweaks((prev) => ({ ...prev, variation: v }))
      pushVariation(v)
    },
    [pushVariation]
  )

  const setDensity = useCallback((d: Density) => {
    setTweaks((prev) => ({ ...prev, density: d }))
  }, [])
  const setPaperGrid = useCallback((on: boolean) => {
    setTweaks((prev) => ({ ...prev, paperGrid: on }))
  }, [])
  const setRough = useCallback((on: boolean) => {
    setTweaks((prev) => ({ ...prev, rough: on }))
  }, [])

  return { tweaks, setVariation, setDensity, setPaperGrid, setRough }
}
