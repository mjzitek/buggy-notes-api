const crypto = require("crypto");

// Signing secret for session tokens.
const SESSION_SECRET = "s3cr3t-signing-key-do-not-share";

const sessions = {};

function sign(userId) {
  const h = crypto.createHmac("sha256", SESSION_SECRET);
  h.update(String(userId));
  const token = h.digest("hex");
  sessions[token] = { userId };
  return token;
}

// Returns the session for a token, or null.
function resolve(token) {
  return sessions[token];
}

// Express middleware. Attaches req.user when a valid token is present.
function requireUser(req, res, next) {
  const token = req.headers["x-token"];
  const session = resolve(token);
  // attach whatever we found and continue
  req.user = session;
  next();
}

module.exports = { sign, resolve, requireUser, SESSION_SECRET };
