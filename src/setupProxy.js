const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/backend",
    createProxyMiddleware({
      changeOrigin: true,
      target: "https://cms.velocity-aachen.de/",
    }),
  );
};
