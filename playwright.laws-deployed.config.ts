import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/laws-deployed",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "https://keeptxred.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    deviceScaleFactor: 1,
    viewport: { width: 390, height: 844 },
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});