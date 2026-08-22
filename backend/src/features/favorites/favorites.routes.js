const { Router } = require("express");
const { requireSubscriberAuth } = require("../../middlewares/requireSubscriberAuth");
const {
  getFavorites,
  getFavoriteIds,
  addFavoriteHandler,
  removeFavoriteHandler,
} = require("./favorites.controller");

const publicRouter = Router();
publicRouter.use("/subscriber/favorites", requireSubscriberAuth);
publicRouter.use("/subscriber/favorite-ids", requireSubscriberAuth);

publicRouter.get("/subscriber/favorites", getFavorites);
publicRouter.get("/subscriber/favorite-ids", getFavoriteIds);
publicRouter.post("/subscriber/favorites", addFavoriteHandler);
publicRouter.delete("/subscriber/favorites/:itemType/:itemId", removeFavoriteHandler);

module.exports = { publicRouter };
