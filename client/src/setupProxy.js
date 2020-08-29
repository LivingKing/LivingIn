const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/auth/",
    createProxyMiddleware({
      target: "http://localhost:8000/",
      changeOrigin: true,
    })
  );
  app.use(
    "/create",
    createProxyMiddleware({
      target: "http://localhost:8000/",
      changeOrigin: true,
    })
  );
};
