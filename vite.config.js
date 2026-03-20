import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Proxy short code requests (6 char alphanumeric) to backend
      // This catches requests like /ta22QV and proxies them to the backend
      // The backend will handle the redirect to the original URL
      '^/[a-zA-Z0-9]{6}$': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
