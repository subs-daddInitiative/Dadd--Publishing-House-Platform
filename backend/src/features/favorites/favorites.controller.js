const {
  listFavorites,
  listFavoriteIds,
  addFavorite,
  removeFavorite,
} = require("./favorites.repository");

const VALID_TYPES = ["blog", "study"];

async function getFavorites(req, res, next) {
  try {
    const data = await listFavorites(req.subscriber.sub);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getFavoriteIds(req, res, next) {
  try {
    const rows = await listFavoriteIds(req.subscriber.sub);
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

async function addFavoriteHandler(req, res, next) {
  try {
    const itemType = req.body.item_type;
    const itemId = Number(req.body.item_id);

    if (!VALID_TYPES.includes(itemType) || !Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid favorite payload" });
    }

    await addFavorite(req.subscriber.sub, itemType, itemId);
    res.status(201).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

async function removeFavoriteHandler(req, res, next) {
  try {
    const { itemType, itemId } = req.params;
    const id = Number(itemId);

    if (!VALID_TYPES.includes(itemType) || !Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid favorite payload" });
    }

    await removeFavorite(req.subscriber.sub, itemType, id);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { getFavorites, getFavoriteIds, addFavoriteHandler, removeFavoriteHandler };
