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
        target: process.env.VITE_BACKEND_URL || 'http://localhost:9191',
        changeOrigin: true,
        secure: false,
        // Bypass proxy for browser page requests (HTML)
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url;
          }
        },
        // Explicitly preserve headers
        headers: {
          'Connection': 'keep-alive'
        },
        // Add logging for debugging
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 Proxying:', req.method, req.url, '→', options.target);
            // Log if Authorization header is present
            const authHeader = req.headers['authorization'];
            if (authHeader) {
              console.log('✅ Auth header present:', authHeader.substring(0, 20) + '...');
            } else {
              console.log('⚠️  No Authorization header');
            }
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Response:', req.method, req.url, '→', proxyRes.statusCode);
          });
        }
      }
    }
  }
})
