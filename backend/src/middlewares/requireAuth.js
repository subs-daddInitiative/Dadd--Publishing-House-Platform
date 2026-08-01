const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function requireAuth(req, res, next) {
  const token = req.cookies?.session_token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    req.user = jwt.verify(token, env.jwt.secret);
    next();
  } catch (error) {
    res.clearCookie("session_token", { path: "/" });
    res.status(401).json({ success: false, message: "Session expired" });
  }
}

module.exports = { requireAuth };
