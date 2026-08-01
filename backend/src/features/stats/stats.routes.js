const { Router } = require("express");
const { getPublicStats } = require("./stats.controller");

const publicRouter = Router();
publicRouter.get("/stats", getPublicStats);

module.exports = { publicRouter };
