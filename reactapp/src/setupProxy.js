const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/hello",
    "/weatherforecast",
    "/signin-oidc",
    "/signout-oidc",
    "/login",
    "/logout"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7170',
        secure: false
    });

    app.use(appProxy);
};
