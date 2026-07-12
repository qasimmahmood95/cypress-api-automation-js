const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Override with CYPRESS_BASE_URL for other environments
    baseUrl: 'https://restful-booker.herokuapp.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    // Pure API suite — no UI to record
    video: false,
    screenshotOnRunFailure: false,
    // The public demo API can be flaky; retry only in CI/headless runs
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      // Public demo credentials for restful-booker; override real secrets
      // via CYPRESS_apiUsername / CYPRESS_apiPassword environment variables
      apiUsername: 'admin',
      apiPassword: 'password123',
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      reportFilename: 'index',
      charts: true,
      reportPageTitle: 'Restful Booker API Test Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
