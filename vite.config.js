import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
 server: {
    port: 3000,
    proxy: {
      // Redirige toutes les requêtes /api vers le backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})