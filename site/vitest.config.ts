import { defineConfig, mergeConfig } from "vitest/config";
import vite from "./vite.config";
export default mergeConfig(
  vite,
  defineConfig({
    test: {
      environment: "happy-dom",
      include: ["tests/**/*.spec.ts"],
      exclude: ["tests/browser/**"],
      clearMocks: true,
    },
  }),
);
