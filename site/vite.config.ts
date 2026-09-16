import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/zt-ui/' : '/',
  plugins: [
    vue(),
    {
      name: 'zt-ui-watch-library-source',
      configureServer(server) {
        // The library lives outside the site root. Watch type-only dependencies
        // too, so Vue can invalidate cached defineProps definitions on edits.
        server.watcher.add(resolve(__dirname, '../src'))
      },
    },
  ],
  resolve: {
    alias: [
      { find: /^@ztechjs\/zt-ui$/, replacement: resolve(__dirname, '../src/index.ts') },
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
  server: {
    port: 4173,
  },
})
