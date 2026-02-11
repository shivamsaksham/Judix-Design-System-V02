import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
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
