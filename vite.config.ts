import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite que otros dispositivos accedan
    port: 5173, // opcional, pero por claridad
    proxy: {
      '/api': {
        target: 'http://myassist-me.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false, // para evitar problemas de SSL
      },
      '/oauth': {
        target: 'https://myassist-me.com',
        changeOrigin: true,
        secure: false,
      },
      '/db': {
        target: 'https://myassist-me.com',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  build: {
    // Generar el build directamente en la carpeta del servidor estático
    outDir: '../../apis/staticSever/dist',
  },
})
