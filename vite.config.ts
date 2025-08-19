import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_BASE_URL = 'https://myassist-me.com'

const createProxyConfig = (path: string, rewrite?: (path: string) => string) => ({
  target: API_BASE_URL,
  changeOrigin: true,
  secure: false,
  ...(rewrite && { rewrite })
})

// Configuración específica para OAuth
const oauthProxyConfig = {
  target: 'https://myassist-me.com',
  changeOrigin: true,
  secure: false,
  rewrite: (path: string) => path
}

export default defineConfig({
  plugins: [react()],
  // Base dinámica para despliegues bajo subruta (p. ej. GitHub Pages)
  // Si VITE_BASE no está definida, usa la raíz '/'
  base: process.env.VITE_BASE || '/',
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': createProxyConfig('/api', (path) => path.replace(/^\/api/, '')),
      '/oauth': oauthProxyConfig,
      '/db': createProxyConfig('/db', (path) => path),
      '/config.json': createProxyConfig('/config.json'),
    }
  },
  build: {
    outDir: 'dist',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
