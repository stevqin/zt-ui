import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /^@ztechjs\/zt-ui$/,
        replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'happy-dom',
    clearMocks: true,
    include: ['tests/**/*.spec.ts', 'src/components/**/*.spec.ts'],
  },
});
