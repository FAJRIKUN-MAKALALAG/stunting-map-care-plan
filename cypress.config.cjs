const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080", // Ganti jika frontend Anda di port lain
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
