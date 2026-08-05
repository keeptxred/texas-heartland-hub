import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/elections",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "bun run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "mobile-chromium", use: { browserName: "chromium" } }],
});
