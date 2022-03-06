import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve("src/components/exports.js"),
      name: "AwesomeScroll",
      formats: ["es", "umd"],
      fileName: (fmt) => `ascroll.${fmt}.js`
    }
  },
  plugins: [vue()]
})
