import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/student-batches': {
        target: 'http://192.168.1.18:5151', // Corrected: StudentBatchController is in Main LMS (5151)
        changeOrigin: true,
        secure: false,
      },
      '/api/fee-management': {
        target: 'http://192.168.1.11:8080', // Fee Management Backend (Settings)
        changeOrigin: true,
        secure: false,
      },
      '/api/fee-management/master-settings': {
        target: 'http://192.168.1.11:8080', // Fee Management Backend (Settings)
        changeOrigin: true,
        secure: false,
      },
      '/api/transport': {
        target: 'http://192.168.1.4:9191', // Transport Management Backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api': {
        target: 'http://192.168.1.18:5151', // Gateway / Other Modules
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://192.168.1.34:8081',
        changeOrigin: true,
        secure: false,
      },
      '/student': {
        target: 'http://192.168.1.34:8081',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://192.168.1.34:8081',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://192.168.1.34:8081',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://192.168.1.18:5151',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            delete proxyRes.headers['x-frame-options'];
          });
        }
      },
      '/library': {
        target: 'http://localhost:9191', // Library backend on local laptop
        changeOrigin: true,
        secure: false,
        bypass: (req, res, options) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }
})
