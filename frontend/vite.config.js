import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configure proxy for backend API
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
