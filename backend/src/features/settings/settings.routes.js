const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { createImageUpload } = require("../../middlewares/imageUpload");
const { compressImages } = require("../../middlewares/compressImage");
const {
  getPublicSettings,
  getAdminSettings,
  updateGeneralSettings,
  uploadLogo,
  listSocialLinks,
  saveSocialLink,
  deleteSocialLink,
} = require("./settings.controller");

const logoUpload = createImageUpload("logos");

const publicRouter = Router();
publicRouter.get("/settings", getPublicSettings);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/settings", requireAdmin, getAdminSettings);
adminRouter.put("/settings", requireAdmin, updateGeneralSettings);
adminRouter.post("/settings/logo", requireAdmin, logoUpload.single("logo"), compressImages, uploadLogo);
adminRouter.get("/settings/social-links", requireAdmin, listSocialLinks);
adminRouter.put("/settings/social-links", requireAdmin, saveSocialLink);
adminRouter.delete("/settings/social-links/:platform", requireAdmin, deleteSocialLink);

module.exports = { publicRouter, adminRouter };
