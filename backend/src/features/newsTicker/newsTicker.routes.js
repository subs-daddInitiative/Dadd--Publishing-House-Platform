const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const {
  getPublicTicker,
  getAdminTicker,
  createItemHandler,
  updateItemHandler,
  deleteItemHandler,
} = require("./newsTicker.controller");

const publicRouter = Router();
publicRouter.get("/news-ticker", getPublicTicker);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/news-ticker", requireAdmin, getAdminTicker);
adminRouter.post("/news-ticker", requireAdmin, createItemHandler);
adminRouter.put("/news-ticker/:id", requireAdmin, updateItemHandler);
adminRouter.delete("/news-ticker/:id", requireAdmin, deleteItemHandler);

module.exports = { publicRouter, adminRouter };
