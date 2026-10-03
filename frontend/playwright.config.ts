import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3101",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node dist/main.js",
      cwd: "../backend",
      url: "http://localhost:3100",
      reuseExistingServer: false,
      env: { PORT: "3100", WORLDS_DIR: path.resolve("../tmp/e2e-worlds") },
    },
    {
      command: "npm run dev -- --port 3101",
      url: "http://localhost:3101",
      reuseExistingServer: false,
      env: { NEXT_PUBLIC_BACKEND_URL: "http://localhost:3100" },
      timeout: 120000,
    },
  ],
});
