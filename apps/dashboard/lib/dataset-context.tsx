"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Dataset } from "@workspace/domain"

const DatasetContext = createContext<Dataset | null>(null)

export interface DatasetProviderProps {
  dataset: Dataset
  children: ReactNode
}

export function DatasetProvider({ dataset, children }: DatasetProviderProps) {
  return <DatasetContext.Provider value={dataset}>{children}</DatasetContext.Provider>
}

export function useDataset(): Dataset {
  const value = useContext(DatasetContext)
  if (value === null) {
    throw new Error(
      "useDataset must be used inside a <DatasetProvider>. Wrap your component tree with <DatasetProvider dataset={...}>."
    )
  }
  return value
}
