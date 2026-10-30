import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/zt-ui/" : "/",
  plugins: [
    vue(),
    {
      name: "watch-component-library",
      configureServer(server) {
        // Vue macro type imports outside the site root must participate in HMR.
        server.watcher.add(resolve(__dirname, "../src"));
      },
    },
  ],
  resolve: {
    dedupe: ["vue"],
    alias: [
      {
        find: /^@ztechjs\/zt-ui\/vtable$/,
        replacement: resolve(
          __dirname,
          "../src/components/vtable-grid/canvas.ts",
        ),
      },
      {
        find: /^@ztechjs\/zt-ui$/,
        replacement: resolve(__dirname, "../src/index.ts"),
      },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 4185,
    fs: { allow: [resolve(__dirname, "..")] },
  },
});
