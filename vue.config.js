module.exports = {
  outputDir: "server/dist/vue",
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:9000",
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: "pl",
      fallbackLocale: "pl",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
};
