const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { subscribe } = require("./newsletter.controller");

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again later." },
});

const publicRouter = Router();
publicRouter.post("/newsletter-signup", signupLimiter, subscribe);

module.exports = { publicRouter };
