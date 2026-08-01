const { env } = require("../../config/env");
const { parseDurationToMs } = require("../../utils/parseDuration");
const { validateLoginPayload } = require("./auth.validation");
const { login: loginUser } = require("./auth.service");
const { findById } = require("./auth.repository");

const AUTH_COOKIE = "session_token";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: parseDurationToMs(env.jwt.expiresIn),
    path: "/",
  };
}

async function login(req, res, next) {
  try {
    const { errors, value } = validateLoginPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const { token, user } = await loginUser(value.email, value.password);
    res.cookie(AUTH_COOKIE, token, cookieOptions());
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.clearCookie(AUTH_COOKIE, { path: "/" });
  res.json({ success: true, data: null });
}

async function me(req, res, next) {
  try {
    const user = await findById(req.user.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, logout, me, AUTH_COOKIE };
