const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const { register, login, logout, me } = require("./subscribers.controller");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again later." },
});

const publicRouter = Router();
publicRouter.post("/subscriber/register", authLimiter, register);
publicRouter.post("/subscriber/login", authLimiter, login);
publicRouter.post("/subscriber/logout", requireSubscriberAuth, logout);
publicRouter.get("/subscriber/me", requireSubscriberAuth, me);

module.exports = { publicRouter };
