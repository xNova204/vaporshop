import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // Ensures assets are loaded correctly
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
})