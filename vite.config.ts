import {defineConfig} from 'vite'
// @ts-ignore
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: '127.0.0.1',
    port: 9008
  },
  build: {
    cssTarget: ['chrome86'],
    target: ['es2015'],

    rollupOptions: {
      input: '/src/build.ts',
      preserveEntrySignatures: 'allow-extension',
      external: [
        'maptalks'
      ],
      output: {
        entryFileNames: (chunkInfo) => {
          return 'MapDebug.js'
        },

        inlineDynamicImports: true,
        format: 'iife',
        name: 'debugMap',
        sourcemap: true,
        globals: {

        }
      }
    }
  }
})
