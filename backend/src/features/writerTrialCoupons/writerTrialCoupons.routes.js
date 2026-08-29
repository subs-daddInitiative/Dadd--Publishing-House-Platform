const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const { getAdminCoupons, createCouponHandler, redeemCouponHandler } = require("./writerTrialCoupons.controller");

const publicRouter = Router();
publicRouter.post("/subscriber/writer-trial/redeem", requireSubscriberAuth, redeemCouponHandler);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/writer-trial-coupons", requireAdmin, getAdminCoupons);
adminRouter.post("/writer-trial-coupons", requireAdmin, createCouponHandler);

module.exports = { publicRouter, adminRouter };
