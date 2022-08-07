import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath,URL } from 'url'

// import Components from 'unplugin-vue-components/vite'
// import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true
    }),
    vueJsx(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: resolve(__dirname, './src/auto-import.d.ts'),
      resolvers: []
    }),

    // Components({
    //   resolvers: [NaiveUiResolver()]
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
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
