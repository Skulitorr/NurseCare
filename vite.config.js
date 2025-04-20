import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        patients: resolve(__dirname, 'patients.html'),
        staff: resolve(__dirname, 'staff.html'),
        inventory: resolve(__dirname, 'inventory.html'),
        schedule: resolve(__dirname, 'schedule.html'),
        chatbot: resolve(__dirname, 'chatbot.html')
      }
    }
  }
})