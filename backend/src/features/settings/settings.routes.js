const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { createImageUpload } = require("../../middlewares/imageUpload");
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
adminRouter.get("/settings", getAdminSettings);
adminRouter.put("/settings", updateGeneralSettings);
adminRouter.post("/settings/logo", logoUpload.single("logo"), uploadLogo);
adminRouter.get("/settings/social-links", listSocialLinks);
adminRouter.put("/settings/social-links", saveSocialLink);
adminRouter.delete("/settings/social-links/:platform", deleteSocialLink);

module.exports = { publicRouter, adminRouter };
