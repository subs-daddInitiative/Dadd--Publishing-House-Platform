const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const {
  getPublicAboutFeatures,
  getAdminAboutFeatures,
  createAboutFeatureHandler,
  updateAboutFeatureHandler,
  deleteAboutFeatureHandler,
} = require("./aboutFeatures.controller");

const publicRouter = Router();
publicRouter.get("/about-features", getPublicAboutFeatures);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/about-features", requireAdmin, getAdminAboutFeatures);
adminRouter.post("/about-features", requireAdmin, createAboutFeatureHandler);
adminRouter.put("/about-features/:id", requireAdmin, updateAboutFeatureHandler);
adminRouter.delete("/about-features/:id", requireAdmin, deleteAboutFeatureHandler);

module.exports = { publicRouter, adminRouter };
