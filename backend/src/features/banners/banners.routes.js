const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { createImageUpload } = require("../../middlewares/imageUpload");
const { compressImages } = require("../../middlewares/compressImage");
const {
  getPublicBanners,
  getAllBanners,
  createBannerHandler,
  updateBannerHandler,
  deleteBannerHandler,
} = require("./banners.controller");

const bannerUpload = createImageUpload("banners");

const publicRouter = Router();
publicRouter.get("/banners", getPublicBanners);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/banners", requireAdmin, getAllBanners);
adminRouter.post("/banners", requireAdmin, bannerUpload.single("image"), compressImages, createBannerHandler);
adminRouter.put("/banners/:id", requireAdmin, bannerUpload.single("image"), compressImages, updateBannerHandler);
adminRouter.delete("/banners/:id", requireAdmin, deleteBannerHandler);

module.exports = { publicRouter, adminRouter };
