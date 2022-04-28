// A rather magical feature of react-scripts allows us to
// specify dev-time proxy settings in this file.
// It seems this is necessary to allow GraphQL's WebSocket
// link through the proxy.

const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://localhost:4000/graphql',
      ws: true
    })
  )
}
