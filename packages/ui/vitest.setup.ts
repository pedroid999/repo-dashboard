import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)

globalThis.ResizeObserver ||= class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.IntersectionObserver ||= class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  root = null
  rootMargin = ''
  thresholds = []
} as unknown as typeof IntersectionObserver
