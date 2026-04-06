import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3001,
    host: true,
    strictPort: true, // Évite le changement automatique de port

    // Configuration HMR optimisée
    hmr: {
      host: 'localhost',
      port: 3001,
      protocol: 'ws'
    },

    // Proxy pour le backend (3002)
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        timeout: 30000
      }
    }
  },

  // Configuration BUILD production
  build: {
    outDir: 'dist',
    sourcemap: false, // Désactivé en prod pour la performance
    minify: 'terser', // Minification agressive
    terserOptions: {
      compress: {
        drop_console: true, // Supprime console.log en prod
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000 // Augmente la limite d'avertissement
  },

  // Configuration PREVIEW (simulation prod)
  preview: {
    port: 3001,
    host: true
  },

  // Optimisations
  css: {
    devSourcemap: false, // Pas de sourcemap CSS en prod
    postcss: './postcss.config.js'
  },

  // Variables d'environnement
  envPrefix: 'VITE_'
});