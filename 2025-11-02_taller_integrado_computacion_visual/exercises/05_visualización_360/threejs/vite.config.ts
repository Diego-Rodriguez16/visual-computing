import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp4', '**/*.webm'],
  server: {
    host: true,
    port: 3000
  },
  optimizeDeps: {
    include: ['three']
  }
})