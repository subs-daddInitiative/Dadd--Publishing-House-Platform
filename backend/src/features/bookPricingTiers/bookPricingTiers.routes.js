const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { getPublicTiers, getAdminTiers, updateTiersHandler } = require("./bookPricingTiers.controller");

const publicRouter = Router();
publicRouter.get("/book-pricing-tiers", getPublicTiers);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/book-pricing-tiers", requireAdmin, getAdminTiers);
adminRouter.put("/book-pricing-tiers", requireAdmin, updateTiersHandler);

module.exports = { publicRouter, adminRouter };
