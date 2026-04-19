export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando dashboard"
      className="min-h-screen bg-background text-foreground"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <div
          data-skeleton="topbar"
          className="h-14 w-full animate-pulse rounded-md bg-card"
        />
        <div className="grid grid-cols-[260px_1fr] gap-6">
          <aside
            data-skeleton="sidebar"
            className="h-[70vh] animate-pulse rounded-md bg-card"
          />
          <section className="flex flex-col gap-4">
            <div
              data-skeleton="hero"
              className="h-24 animate-pulse rounded-md bg-card"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  data-skeleton="card"
                  className="h-40 animate-pulse rounded-md bg-card"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
