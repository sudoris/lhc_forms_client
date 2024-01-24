import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/lhc_forms_client/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       assetFileNames: "[name]-[hash][extname]",
  //       chunkFileNames: "[name]-[hash].js",
  //       entryFileNames: "[name]-[hash].js",
  //     }
  //   }
  // }
})
