import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vaporshop/', // Ensures assets are loaded correctly
  build: {
    outDir: 'build',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
})