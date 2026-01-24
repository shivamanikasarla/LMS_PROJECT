import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Default Vite port
    proxy: {
      // Proxy all /transport API requests to Spring Boot backend
      '/transport': {
        target: 'http://192.168.1.27:9191',
        changeOrigin: true,
        secure: false,
      },
      // You can add more API paths here if needed
      // Example: '/api': { target: 'http://localhost:9191', changeOrigin: true },
    }
  }
})
