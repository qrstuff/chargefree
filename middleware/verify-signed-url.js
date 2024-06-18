const createError = require("http-errors");
const crypto = require("crypto");

const expiration = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiration time
const secret = process.env.URL_SIGNING_SECRET;

function generate(path, req) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(path + expiration);
  const signature = hmac.digest("hex");

  const host = req.headers["x-forwarded-host"] || req.headers.host;

  return `${req.protocol}://${host}${path}?expires=${expiration}&signature=${signature}`;
}

function verify(req, res, next) {
  const secret = process.env.URL_SIGNING_SECRET;
  const { expires, signature } = req.query;

  if (!expires || !signature) {
    return next(createError(400, "Unsigned Request"));
  }

  if (Math.floor(Date.now() / 1000) > parseInt(expires)) {
    return next(createError(403, "Expired Request"));
  }

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(req.path + expires);
  const expected = hmac.digest("hex");

  if (signature !== expected) {
    return next(createError(401, "Invalid Request"));
  }

  next();
}

module.exports = { generate, verify };
