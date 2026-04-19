import { createVitestConfig } from '@workspace/vitest-config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const serverOnlyStub = fileURLToPath(
  new URL(
    '../../node_modules/.pnpm/server-only@0.0.1/node_modules/server-only/empty.js',
    import.meta.url
  )
)

export default createVitestConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'server-only': serverOnlyStub,
    },
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.stories.tsx',
        '**/*.config.{ts,mjs}',
        '**/index.ts',
        '**/*.d.ts',
        '**/__tests__/**',
        'app/layout.tsx',
      ],
      thresholds: { perFile: true, lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
})
