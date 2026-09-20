const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const {
  getAdminTrials,
  getAdminTrial,
  createTrial,
  updateTrial,
  deleteTrial,
  getPublicTrials,
  redeemTrial,
} = require("./contentTrials.controller");

const publicRouter = Router();
publicRouter.get("/content-trials", getPublicTrials);
publicRouter.post("/content-trials/redeem", requireSubscriberAuth, redeemTrial);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/content-trials", requireAdmin, getAdminTrials);
adminRouter.get("/content-trials/:id", requireAdmin, getAdminTrial);
adminRouter.post("/content-trials", requireAdmin, createTrial);
adminRouter.put("/content-trials/:id", requireAdmin, updateTrial);
adminRouter.delete("/content-trials/:id", requireAdmin, deleteTrial);

module.exports = { publicRouter, adminRouter };
