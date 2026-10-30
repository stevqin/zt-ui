import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4190",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    launchOptions: {
      channel: process.env.ZT_DOCS_BROWSER_CHANNEL || undefined,
    },
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4190 --strictPort",
    url: "http://127.0.0.1:4190",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
