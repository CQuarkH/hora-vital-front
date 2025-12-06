import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  projectId: '8wvc8e',
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
    // Configuración para tests E2E reales
    env: {
      API_URL: "http://localhost:4000",
    },
    // Timeouts más largos para llamadas reales al backend
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    // Reintentos en caso de fallo
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  video: false,
  screenshotOnRunFailure: true,
  // Viewport por defecto
  viewportWidth: 1280,
  viewportHeight: 720,
});
