const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { requireAuth } = require("../../middlewares/requireAuth");
const { login, logout, me } = require("./auth.controller");

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

router.post("/auth/login", loginLimiter, login);
router.post("/auth/logout", requireAuth, logout);
router.get("/auth/me", requireAuth, me);

module.exports = router;
