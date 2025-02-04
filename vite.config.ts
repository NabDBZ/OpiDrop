import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'i18n': ['i18next', 'react-i18next'],
          'icons': ['lucide-react'],
          'utils': [
            '/src/utils/animations.ts',
            '/src/utils/caching.ts',
            '/src/utils/performance.ts'
          ]
        }
      }
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  }
});