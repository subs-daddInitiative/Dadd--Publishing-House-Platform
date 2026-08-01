const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { createImageUpload } = require("../../middlewares/imageUpload");
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
adminRouter.get("/banners", getAllBanners);
adminRouter.post("/banners", bannerUpload.single("image"), createBannerHandler);
adminRouter.put("/banners/:id", bannerUpload.single("image"), updateBannerHandler);
adminRouter.delete("/banners/:id", deleteBannerHandler);

module.exports = { publicRouter, adminRouter };
