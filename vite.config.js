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
        // Use environment variable or default to friend's backend
        target: process.env.VITE_BACKEND_URL || 'http://192.168.1.16:9191',

        changeOrigin: true,
        secure: false,
        // Bypass proxy for browser page requests (HTML)
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        }
      },
      // Proxy for Users Service
      '/users': {
        target: 'http://192.168.1.22:8081',
        changeOrigin: true,
        secure: false,
      },
      // Proxy for Admin Service
      '/admin': {
        target: 'http://192.168.1.22:8081',
        changeOrigin: true,
        secure: false,
      },
      // Proxy for Auth Service
      '/auth': {
        target: 'http://192.168.1.22:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
