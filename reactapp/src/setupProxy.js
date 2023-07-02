const { createProxyMiddleware } = require('http-proxy-middleware');

// TODO: can we add "/api/*"?
const context = [
    "/api/WeatherForecast",
    "/api/open",
    "/api/protected",
    "/signin-oidc",
    "/signout-oidc", // Is this used?
    "/signout-callback-oidc",
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
