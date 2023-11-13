import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "lhc_forms_client/assets/[name]-[hash][extname]",
        chunkFileNames: "lhc_forms_client/assets/[name]-[hash].js",
        entryFileNames: "lhc_forms_client/assets/[name]-[hash].js",
      }
    }
  }
})
