const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authorizationMiddleware(req, res, next) {
  if (!req.headers['x-access-token']) {
    throw new ClientError(401, 'authentication required');
  }
  const token = req.headers['x-access-token'];
  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload;
  } catch (err) {
    console.error(err);
  }
  next();
}

module.exports = authorizationMiddleware;
