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
  getPlanCategoriesHandler,
  updatePlanCategoriesHandler,
} = require("./contentAccess.controller");

const publicRouter = Router();
publicRouter.get("/content-access-plans", getContentPlans);
publicRouter.post("/subscriber/content-access/checkout", requireSubscriberAuth, checkoutAccess);
publicRouter.post("/subscriber/studies/:id/purchase", requireSubscriberAuth, purchaseStudy);
publicRouter.get("/subscriber/content-access/status", requireSubscriberAuth, getAccessStatus);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.put("/content-access-plans", requireAdmin, updatePlanPriceHandler);
adminRouter.get("/content-access-plans/:id/categories", requireAdmin, getPlanCategoriesHandler);
adminRouter.put("/content-access-plans/:id/categories", requireAdmin, updatePlanCategoriesHandler);

module.exports = { publicRouter, adminRouter };
