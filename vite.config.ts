import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite que otros dispositivos accedan
    port: 5173, // opcional, pero por claridad
  },
  build: {
    // Generar el build directamente en la carpeta del servidor estático
    outDir: '../../apis/staticSever/dist',
  },
})
