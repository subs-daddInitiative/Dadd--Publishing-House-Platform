const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const {
  getPaymentMethods,
  getPublicPlans,
  checkout,
  webhook,
  getCheckoutStatus,
  updatePlanPriceHandler,
} = require("./subscriptions.controller");

const publicRouter = Router();
publicRouter.get("/payment-methods", getPaymentMethods);
publicRouter.get("/subscription-plans", getPublicPlans);
publicRouter.post("/subscription-webhook", webhook);
publicRouter.post("/subscriber/subscriptions", requireSubscriberAuth, checkout);
publicRouter.get("/subscriber/subscriptions/status", requireSubscriberAuth, getCheckoutStatus);
publicRouter.get("/subscriber/subscriptions/:id", requireSubscriberAuth, getCheckoutStatus);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.put("/subscription-plans", requireAdmin, updatePlanPriceHandler);

module.exports = { publicRouter, adminRouter };
