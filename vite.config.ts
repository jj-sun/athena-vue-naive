import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'

const resolve = (dir: string) => {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  server: {
    host: true,
    port: 8888,
    open: false,
    https: false,
    proxy: {
      '/athena': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    },
    origin: 'http://localhost:8888'
  }
})
