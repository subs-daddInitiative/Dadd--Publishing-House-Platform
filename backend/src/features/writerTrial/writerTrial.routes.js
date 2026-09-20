const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { getPublicSettings, getAdminSettings, updateAdminSettings } = require("./writerTrial.controller");

const publicRouter = Router();
publicRouter.get("/writer-trial-settings", getPublicSettings);

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/writer-trial-settings", requireAdmin, getAdminSettings);
adminRouter.put("/writer-trial-settings", requireAdmin, updateAdminSettings);

module.exports = { publicRouter, adminRouter };
