import { createVitestConfig } from '@workspace/vitest-config'
import react from '@vitejs/plugin-react'

export default createVitestConfig({
  plugins: [react()],
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
        'components/theme-provider.tsx',
      ],
      thresholds: { perFile: true, lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
})
