import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const canvas = mode === 'canvas' || mode === 'canvas-umd'
  const umd = mode === 'umd' || mode === 'canvas-umd'
  return {
    plugins: [
      vue(),
      ...(umd || canvas ? [] : [dts({
        tsconfigPath: './tsconfig.build.json',
        exclude: ['src/components/vtable-grid/ZtVTableGrid.vue'],
        copyDtsFiles: true,
      })]),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      // ESM shares the consumer's feedback singleton. The standalone UMD embeds it.
      emptyOutDir: !umd && !canvas,
      lib: {
        entry: resolve(__dirname, canvas ? 'src/components/vtable-grid/canvas.ts' : 'src/index.ts'),
        name: canvas ? 'ZtUIVTable' : 'ZtUI',
        fileName: canvas ? 'vtable' : 'zt-ui',
        formats: [umd ? 'umd' : 'es'],
      },
      rollupOptions: {
        external: ['vue', '@visactor/vtable', '@visactor/vtable-editors', '@visactor/vue-vtable', ...(umd ? [] : ['@ztechjs/zt-alert'])],
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
  }
})
