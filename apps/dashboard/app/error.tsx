"use client"

import { useEffect } from "react"
import { Button } from "@workspace/ui/components/button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Filters env-derived PII out of a free-form error message before surfacing it
 * to the UI. Any token matching `GITLAB_*(...)` (or a bare `GITLAB_X=value`)
 * is replaced so it cannot leak into rendered HTML or the browser's DOM.
 * See GL-3 (token never appears in rendered HTML) and GL-8 (UX boundaries).
 */
export function sanitizeErrorMessage(raw: string): string {
  if (!raw) return ""
  return raw
    .replace(/GITLAB_[A-Z_]+\s*=\s*\S+/g, "[redactado]")
    .replace(/GITLAB_[A-Z_]+/g, "[redactado]")
    .replace(/glpat-[A-Za-z0-9_-]+/g, "[redactado]")
    .trim()
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    if (error?.message) {
      console.error("[dashboard] boundary", {
        digest: error.digest,
        name: error.name,
      })
    }
  }, [error])

  const sanitized = sanitizeErrorMessage(error?.message ?? "")
  const fallback = "Intenta nuevamente en unos segundos."

  return (
    <main
      role="alert"
      aria-live="assertive"
      className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-foreground"
    >
      <div className="space-y-3 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Algo salió mal
        </h1>
        <p className="text-sm text-muted-foreground">
          {sanitized.length > 0 ? sanitized : fallback}
        </p>
      </div>
      <Button onClick={reset} variant="default">
        Reintentar
      </Button>
    </main>
  )
}
