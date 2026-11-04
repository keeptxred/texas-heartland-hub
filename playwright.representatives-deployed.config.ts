import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/representatives",
  testMatch: "**/*.pw.ts",
  timeout: 45_000,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: 1,
  fullyParallel: false,
  reporter: "list",
  use: {
    browserName: "chromium",
    headless: true,
    viewport: { width: 375, height: 812 },
    baseURL: process.env.SITE_URL || "https://keeptxred-site.freddy-coppola.workers.dev",
    extraHTTPHeaders: { "x-keeptxred-deployment-smoke": "canonical" },
  },
});
