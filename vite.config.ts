import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      exclude: ['src/components/vtable-grid/ZtVTableGrid.vue'],
      copyDtsFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ZtUI',
      fileName: 'zt-ui',
    },
    rollupOptions: {
      external: ['vue', '@visactor/vtable', '@visactor/vtable-editors', '@visactor/vue-vtable'],
      output: {
        globals: {
          vue: 'Vue',
          '@visactor/vtable': 'VTable',
          '@visactor/vtable-editors': 'VTableEditors',
          '@visactor/vue-vtable': 'VueVTable',
        },
      },
    },
  },
})
