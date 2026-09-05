const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const { createImageUpload } = require("../../middlewares/imageUpload");
const { compressImages } = require("../../middlewares/compressImage");
const {
  register,
  login,
  logout,
  me,
  updateProfileHandler,
  changePasswordHandler,
} = require("./subscribers.controller");

const avatarUpload = createImageUpload("subscriber-avatars");

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
publicRouter.put(
  "/subscriber/profile",
  requireSubscriberAuth,
  avatarUpload.single("profile_image"),
  compressImages,
  updateProfileHandler
);
publicRouter.put("/subscriber/password", requireSubscriberAuth, changePasswordHandler);

module.exports = { publicRouter };
