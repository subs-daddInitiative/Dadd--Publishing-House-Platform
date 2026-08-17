const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function optionalSubscriberAuth(req, res, next) {
  const token = req.cookies?.subscriber_session;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, env.subscriberJwt.secret);
    if (payload.type === "subscriber") {
      req.subscriber = payload;
    }
  } catch {
    // Not logged in, or an expired/invalid token - treat as anonymous.
  }
  next();
}

module.exports = { optionalSubscriberAuth };
