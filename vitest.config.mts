import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { loadTestEnvironment } from './tests/helpers/testEnv'

loadTestEnvironment()

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    fileParallelism: false,
  },
})
