const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { createImageUpload } = require("../../middlewares/imageUpload");
const { compressImages } = require("../../middlewares/compressImage");
const {
  getPublicAds,
  getAdminAds,
  createAdHandler,
  updateAdHandler,
  deleteAdHandler,
  getAdTranslationsHandler,
  upsertAdTranslationHandler,
  deleteAdTranslationHandler,
} = require("./siteAds.controller");

const adUpload = createImageUpload("ads");

const publicRouter = Router();
publicRouter.get("/site-ads", getPublicAds);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/site-ads", requireAdmin, getAdminAds);
adminRouter.post("/site-ads", requireAdmin, adUpload.single("image"), compressImages, createAdHandler);
adminRouter.put("/site-ads/:id", requireAdmin, adUpload.single("image"), compressImages, updateAdHandler);
adminRouter.delete("/site-ads/:id", requireAdmin, deleteAdHandler);
adminRouter.get("/site-ads/:id/translations", requireAdmin, getAdTranslationsHandler);
adminRouter.put("/site-ads/:id/translations/:locale", requireAdmin, upsertAdTranslationHandler);
adminRouter.delete("/site-ads/:id/translations/:locale", requireAdmin, deleteAdTranslationHandler);

module.exports = { publicRouter, adminRouter };
