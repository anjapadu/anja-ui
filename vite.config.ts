/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    coverage: {
      reporter: ["text", "lcov", "json-summary", "json"],
      reportOnFailure: true,
      all: true,
      include: ["src/components/**/*.{ts,tsx}", "src/utils/**/*.{ts,tsx}"],
      exclude: [
        "src/index.ts",
        "src/**/index.{ts,tsx}",
        "src/**/*.stories.{ts,tsx}",
        "src/test/**",
        "src/App.tsx",
        "src/main.tsx",
        "dist/**",
        "**/*.config.{ts,js,mjs,cjs}",
        ".storybook/**",
      ],
    },
    projects: [
      {
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["src/test/setup.ts"],
          include: ["src/**/*/*.test.tsx"],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
