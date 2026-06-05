import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    chromeWebSecurity: false,
    pageLoadTimeout: 30000,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 2,
    },
    setupNodeEvents(on, config) {},
  },
});
