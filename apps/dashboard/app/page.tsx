import { DashboardShell } from "../components/shell/dashboard-shell"
import { getDataset } from "../lib/data-source"
import { parseVariation } from "../lib/variation"

interface PageProps {
  searchParams: Promise<{ v?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { v } = await searchParams
  const dataset = await getDataset()
  const variation = parseVariation(v)
  return (
    <DashboardShell dataset={dataset} initialVariation={variation} />
  )
}
