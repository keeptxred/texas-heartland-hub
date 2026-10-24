import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/laws",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    deviceScaleFactor: 1,
  },
  webServer: {
    command: "bun run build && bun run preview -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    env: { CLOUDFLARE_VITE_REMOTE_BINDINGS: "false" },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
