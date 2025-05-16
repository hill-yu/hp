import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/',
  server: {
    allowedHosts: [
      'popcash.fungameapp.net',
    ],
    proxy: {
      '/api': {
        target: 'https://api.gomatchapp.net/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false // 如果遇到 SSL 问题，可以设置为 false
      }
    },
    cors: true // 启用 CORS
  }
})