const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.dev-r4b2cvtpftu7rqfq.us.auth0.com}/.well-known/jwks.json`
  }),
  audience: process.env.1zPNckfqhJpbTUmulunbzAXll8xMJ6xm,
  issuer: `https://${process.env.dev-r4b2cvtpftu7rqfq.us.auth0.com}/`,
  algorithms: ['RS256']
});

module.exports = authMiddleware;
