
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        console.log("Request URL:",res);

        next();
    });
};