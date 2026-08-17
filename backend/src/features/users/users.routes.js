const { Router } = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");
const { requireAdmin } = require("../../middlewares/requireAdmin");
const { getModerators, createModeratorHandler, deleteModeratorHandler } = require("./users.controller");

const adminRouter = Router();
adminRouter.use(requireAuth);
adminRouter.get("/users", requireAdmin, getModerators);
adminRouter.post("/users", requireAdmin, createModeratorHandler);
adminRouter.delete("/users/:id", requireAdmin, deleteModeratorHandler);

module.exports = { adminRouter };
