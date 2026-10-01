import { defineConfig } from "@playwright/test";

const port = process.env.PORT || "5512";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: Number(process.env.PLAYWRIGHT_WORKERS || 1),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: "chromium",
    channel: process.env.CI ? undefined : "msedge",
  },
  webServer: {
    command: "node dev-server.mjs",
    url: `http://127.0.0.1:${port}`,
    env: { PORT: port },
    reuseExistingServer: false,
  },
});
