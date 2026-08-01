const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { requireAuth } = require("../../middlewares/requireAuth");
const {
  submitMessage,
  getMessages,
  getUnreadCount,
  markMessageAsRead,
  deleteMessage,
} = require("./contact.controller");

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages sent. Try again later." },
});

const publicRouter = Router();
publicRouter.post("/contact", submitLimiter, submitMessage);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/contact-messages", getMessages);
adminRouter.get("/contact-messages/unread-count", getUnreadCount);
adminRouter.patch("/contact-messages/:id/read", markMessageAsRead);
adminRouter.delete("/contact-messages/:id", deleteMessage);

module.exports = { publicRouter, adminRouter };
