import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center p-8">
      <div className="flex max-w-lg flex-col gap-6">
        <h1 className="font-display text-4xl font-bold tracking-[0.08em] uppercase">
          Tech Lead Dashboard
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Monorepo skeleton ready. Design tokens wired to the Kanagawa palette.
          Pantallas vienen en changes siguientes.
        </p>
        <div className="flex gap-3">
          <Button>Hello</Button>
          <Button variant="outline">Secondary</Button>
        </div>
        <p className="text-muted-foreground font-mono text-xs">
          Press <kbd className="border-border bg-muted rounded-sm border px-1.5 py-0.5">d</kbd> to
          toggle dark mode.
        </p>
      </div>
    </main>
  )
}
