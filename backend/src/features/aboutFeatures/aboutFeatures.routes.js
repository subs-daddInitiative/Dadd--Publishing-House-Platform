const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
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
adminRouter.get("/about-features", getAdminAboutFeatures);
adminRouter.post("/about-features", createAboutFeatureHandler);
adminRouter.put("/about-features/:id", updateAboutFeatureHandler);
adminRouter.delete("/about-features/:id", deleteAboutFeatureHandler);

module.exports = { publicRouter, adminRouter };
