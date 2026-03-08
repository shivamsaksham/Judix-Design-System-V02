// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/nextjs-vite";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {}
  },

  staticDirs: ["../public"],

  viteFinal: async (config) => {
    // Alias support (@/components etc.)
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": path.resolve(__dirname, "../src"),
      },
    };

    // Tailwind / PostCSS v4
    config.css = {
      ...config.css,
      postcss: path.resolve(__dirname, "../postcss.config.mjs"),
    };

    return config;
  },
};

export default config;
