import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^@ztechjs\/zt-ui\/vtable$/, replacement: resolve(__dirname, '../src/components/vtable-grid/canvas.ts') },
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
  test: {
    environment: 'happy-dom',
    clearMocks: true,
  },
})
