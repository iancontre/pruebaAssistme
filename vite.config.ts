import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_BASE_URL = 'https://myassist-me.com'

const createProxyConfig = (path: string, rewrite?: (path: string) => string) => ({
  target: API_BASE_URL,
  changeOrigin: true,
  secure: false,
  ...(rewrite && { rewrite })
})

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': createProxyConfig('/api', (path) => path.replace(/^\/api/, '')),
      '/oauth': createProxyConfig('/oauth'),
      '/db': createProxyConfig('/db'),
    }
  },
  build: {
    outDir: '../../apis/staticSever/dist',
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
    postcss: './postcss.config.cjs'
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
