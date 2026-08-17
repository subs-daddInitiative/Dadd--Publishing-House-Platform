const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const {
  requestUpgrade,
  getStatus,
  getPendingRequests,
  decideHandler,
} = require("./writerUpgrades.controller");

const publicRouter = Router();
publicRouter.post("/subscriber/writer-upgrade/request", requireSubscriberAuth, requestUpgrade);
publicRouter.get("/subscriber/writer-upgrade/status", requireSubscriberAuth, getStatus);

// Admins AND moderators can review writer-upgrade requests, so this only
// requires requireAuth (no requireAdmin) - same pattern as blogs/studies.
const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/writer-upgrade-requests", getPendingRequests);
adminRouter.post("/writer-upgrade-requests/:id/decide", decideHandler);

module.exports = { publicRouter, adminRouter };
