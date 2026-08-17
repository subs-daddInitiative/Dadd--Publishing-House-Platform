const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const {
  getContentPlans,
  checkoutAccess,
  purchaseStudy,
  getAccessStatus,
  updatePlanPriceHandler,
} = require("./contentAccess.controller");

const publicRouter = Router();
publicRouter.get("/content-access-plans", getContentPlans);
publicRouter.post("/subscriber/content-access/checkout", requireSubscriberAuth, checkoutAccess);
publicRouter.post("/subscriber/studies/:id/purchase", requireSubscriberAuth, purchaseStudy);
publicRouter.get("/subscriber/content-access/status", requireSubscriberAuth, getAccessStatus);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.put("/content-access-plans", requireAdmin, updatePlanPriceHandler);

module.exports = { publicRouter, adminRouter };
