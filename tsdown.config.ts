import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  format: ['cjs'],
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production',
  },
  external: [
    'vscode',
  ],
})
