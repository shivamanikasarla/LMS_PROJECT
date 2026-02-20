// Load env vars
// Note: Vite uses import.meta.env in client code, but in vite.config.js we use process.env via loadEnv, 
// OR we can just use process.env if we load dotenv. However, standard Vite way is:
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  const TARGET_MAIN = env.VITE_API_TARGET_MAIN || 'http://192.168.1.55:5151'
  const TARGET_FEE = env.VITE_API_TARGET_FEE || 'http://192.168.1.6:3130'
  const TARGET_TRANSPORT = env.VITE_API_TARGET_TRANSPORT || 'http://192.168.1.20:9191'
  const TARGET_ADMIN = env.VITE_API_TARGET_ADMIN || 'http://192.168.1.42:9090'
  const TARGET_LIBRARY = env.VITE_API_TARGET_LIBRARY || 'http://localhost:9191'
  const TARGET_UPLOADS = env.VITE_API_TARGET_UPLOADS || 'http://localhost:5151'
  const TARGET_WEBSITE = env.VITE_API_TARGET_WEBSITE || 'http://192.168.1.42:9090'

  console.log('-----------------------------------------------------')
  console.log('  Vite Proxy Configuration')
  console.log('-----------------------------------------------------')
  console.log(`  Main LMS Backend:      ${TARGET_MAIN}`)
  console.log(`  Fee Management:        ${TARGET_FEE}`)
  console.log(`  Transport Management:  ${TARGET_TRANSPORT}`)
  console.log(`  Admin & Auth Backend:  ${TARGET_ADMIN}`)
  console.log(`  Library Backend:       ${TARGET_LIBRARY}`)
  console.log(`  Uploads Backend:       ${TARGET_UPLOADS}`)
  console.log(`  Website Backend:       ${TARGET_WEBSITE}`)
  console.log('-----------------------------------------------------')

  const ADMIN_TARGET = 'http://192.168.1.42:9090'; // Use IP for connection
  const ADMIN_DOMAIN = 'santoshchavithini.yourdomain.com:9090'; // Domain for Host header

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/student-batches': {
          target: TARGET_MAIN, // StudentBatchController
          changeOrigin: true,
          secure: false,
        },
        '/api/fee-management': {
          target: TARGET_FEE, // Fee Management Backend (Settings)
          changeOrigin: true,
          secure: false,
        },
        '/api/fee-types': {
          target: TARGET_FEE, // Fee Management Backend (Fee Types)
          changeOrigin: true,
          secure: false,
        },
        '/api/fee-structures': {
          target: TARGET_FEE,
          changeOrigin: true,
          secure: false,
        },
        '/api/fee-allocations': {
          target: TARGET_FEE,
          changeOrigin: true,
          secure: false,
        },
        '/api/master-settings': {
          target: TARGET_FEE, // Fee Settings Backend Route
          changeOrigin: true,
          secure: false,
        },
        '/api/transport': {
          target: TARGET_TRANSPORT, // Transport Management Backend
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/gps-websocket': {
          target: TARGET_TRANSPORT,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: TARGET_MAIN, // Gateway / Other Modules
          changeOrigin: true,
          secure: false,
        },
        '/admin': {
          target: ADMIN_TARGET,
          changeOrigin: true,
          secure: false,
          headers: { Host: ADMIN_DOMAIN }
        },
        '/student': {
          target: ADMIN_TARGET,
          changeOrigin: true,
          secure: false,
          headers: { Host: ADMIN_DOMAIN }
        },
        '/website': {
          target: ADMIN_TARGET,
          changeOrigin: true,
          secure: false,
          headers: { Host: ADMIN_DOMAIN }
        },
        '/auth': {
          target: ADMIN_TARGET,
          changeOrigin: true,
          secure: false,
          headers: { Host: ADMIN_DOMAIN }
        },
        '/users': {
          target: ADMIN_TARGET,
          changeOrigin: true,
          secure: false,
          headers: { Host: ADMIN_DOMAIN }
        },
        '/uploads': {
          target: TARGET_UPLOADS,
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              delete proxyRes.headers['x-frame-options'];
            });
          }
        },
        '/library': {
          target: TARGET_LIBRARY, // Library backend
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
  }
})
