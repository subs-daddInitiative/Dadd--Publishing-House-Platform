const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const {
  submitRequest,
  getRequests,
  getUnreadCount,
  markRequestAsRead,
  deleteRequest,
} = require("./joinRequests.controller");

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests sent. Try again later." },
});

const publicRouter = Router();
publicRouter.post("/join-requests", submitLimiter, submitRequest);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/join-requests", requireAdmin, getRequests);
adminRouter.get("/join-requests/unread-count", requireAdmin, getUnreadCount);
adminRouter.patch("/join-requests/:id/read", requireAdmin, markRequestAsRead);
adminRouter.delete("/join-requests/:id", requireAdmin, deleteRequest);

module.exports = { publicRouter, adminRouter };
