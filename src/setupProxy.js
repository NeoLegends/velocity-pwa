const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/backend",
    createProxyMiddleware({
      changeOrigin: true,
      target: "https://cms.velocity-aachen.de/",
    }),
  );
  app.use(
    "/invoices",
    createProxyMiddleware({
      changeOrigin: true,
      target: "https://cms.velocity-aachen.de/backend/app/customer/",
    }),
  );
  app.use(
    "/tile",
    createProxyMiddleware({
      changeOrigin: true,
      pathRewrite: (path, req) => path.replace("/tile", "") + ".png",
      target: "https://a.tile.openstreetmap.de/",
    }),
  );
};
