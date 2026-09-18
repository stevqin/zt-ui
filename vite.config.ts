import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const umd = mode === 'umd'
  return {
    plugins: [
      vue(),
      ...(umd ? [] : [dts({
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
      emptyOutDir: !umd,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ZtUI',
        fileName: 'zt-ui',
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
