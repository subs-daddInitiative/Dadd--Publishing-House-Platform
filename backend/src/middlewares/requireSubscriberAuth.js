const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function requireSubscriberAuth(req, res, next) {
  const token = req.cookies?.subscriber_session;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, env.subscriberJwt.secret);
    if (payload.type !== "subscriber") {
      throw new Error("Invalid token type");
    }
    req.subscriber = payload;
    next();
  } catch (error) {
    res.clearCookie("subscriber_session", { path: "/" });
    res.status(401).json({ success: false, message: "Session expired" });
  }
}

module.exports = { requireSubscriberAuth };
