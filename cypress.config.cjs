const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://stuntingcaresulut.domcloud.dev", // Ganti jika frontend Anda di port lain
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
