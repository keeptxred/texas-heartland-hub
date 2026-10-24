import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/laws",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.LAWS_UX_BASE_URL || "https://keeptxred.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    deviceScaleFactor: 1,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
