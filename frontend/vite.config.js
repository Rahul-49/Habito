import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Add any Node.js built-ins you're using
        'fs',
        'path',
        'http',
        'https',
        'crypto',
        'stream'
      ]
    }
  },
  // Add this if you're using environment variables
  define: {
    'process.env': process.env
  }
})
